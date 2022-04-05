// Package github abstracts GitHub APIs for requesting data and metadata of a
// file within a private or public GitHub repository.
package github

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strings"
	"time"
)

// DefaultHTTPClient is the HTTP client used for all outgoing requests.
var DefaultHTTPClient = &http.Client{Timeout: 10 * time.Second}

// Client is a structure type that contains the important parameters for an HTTP request to GitHub.
type Client struct {
	auth      string
	repoOwner string
	repoName  string
}

// New returns a new client for the given repository.
func New(repoName, repoOwner, auth string) Client {
	return Client{
		auth:      auth,
		repoName:  repoName,
		repoOwner: repoOwner,
	}
}

// GetData retrieves the given file from GitHub and returns a reader to the result.
// The caller must close the reader.
func (c Client) GetData(ctx context.Context, path string) (io.ReadCloser, string, string, error) {
	resp, err := c.requestDataFromGithub(ctx, c.buildURL(path))
	if err != nil {
		return nil, "", "", fmt.Errorf("failed to request data: %v", err)
	}
	defer resp.Body.Close()

	// Make sure we got a successful response.
	if resp.StatusCode != http.StatusOK {
		return nil, "", "", fmt.Errorf("response returned with unexpected status code: %v", resp.StatusCode)
	}

	// Decode the response.
	var result fileMetadata
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, "", "", fmt.Errorf("failed to decode data: %v", err)
	}

	// If the requested file's size is 1 MB or smaller we already have it.
	if result.Encoding == "base64" && len(result.Content) > 0 {
		return ioutil.NopCloser(base64.NewDecoder(base64.StdEncoding, strings.NewReader(result.Content))),
			determineContentType(path), result.Sha, err
	}

	// Otherwise we need a download url.
	if len(result.DownloadURL) == 0 {
		return nil, "", "", errors.New("missing either etag or download url from github")
	}

	// Get the raw file using the download URL.
	resp, err = c.requestDataFromGithub(ctx, result.DownloadURL)
	if err != nil {
		return nil, "", "", fmt.Errorf("failed to request data: %v", err)
	}

	// Caller must close the body.
	return resp.Body, determineContentType(path), result.Sha, err
}

// GetHash checks access permissions for the given file and also returns the
// ETag of the current version.
func (c Client) GetHash(ctx context.Context, path string) (string, error) {
	// We want to query the directory and not the file directly,
	// so find the dir of the current file.
	// If no slashes are in the path, the directory is the empty string.
	dirPath := ""
	if idx := strings.LastIndex(path, "/"); idx != -1 {
		dirPath = path[:idx]
	}

	resp, err := c.requestDataFromGithub(ctx, c.buildURL(dirPath))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Directory queries return arrays of metadata, one for each file.
	var result []fileMetadata
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	// Find the file we care about.
	metadata := findFileMetadata(result, path)
	if len(metadata.Sha) == 0 {
		return "", fmt.Errorf("failed to find %v in repository", path)
	}

	return metadata.Sha, nil
}

// determineContentType determines the content type based on the file extension for the
// given file. It returns application/octet-stream the type is unknown.
func determineContentType(path string) string {
	switch filepath.Ext(path) {
	case ".jt":
		return "model/vnd.siemens.openjt"
	case ".stp":
		return "model/iso.step.ap203"
	case ".x3d":
		return "model/x3d+xml"
	case ".plmxml":
		return "model/vnd.siemens.plmxml"
	case ".3dm":
		return "model/vnd.3dm"
	case ".obj":
		return "model/obj"
	default:
		return "application/octet-stream"
	}
}

// fileMetadata represents the format returned by GitHub API calls for each
// file in a repository.
type fileMetadata struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	Sha         string `json:"sha"`
	Size        int    `json:"size"`
	URL         string `json:"url"`
	HTMLURL     string `json:"html_url"`
	GitURL      string `json:"git_url"`
	DownloadURL string `json:"download_url"`
	Type        string `json:"type"`
	Content     string `json:"content"`
	Encoding    string `json:"encoding"`
	Links       struct {
		Self string `json:"self"`
		Git  string `json:"git"`
		HTML string `json:"html"`
	} `json:"_links"`
}

// requestDataFromGithub fetches the response from the given url and adds any
// authorization tokens if necessary.
func (c Client) requestDataFromGithub(ctx context.Context, url string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	// Set the authorization token to the request header if we have one.
	if len(c.auth) > 0 {
		req.Header.Add("Authorization", c.auth)
	}

	// Send request using http client.
	resp, err := DefaultHTTPClient.Do(req)
	return resp, err
}

// buildURL creates a full URL for the given path in the current repository.
func (c Client) buildURL(path string) string {
	return "https://api.github.com/repos/" + c.repoOwner + "/" + c.repoName + "/contents/" + path
}

// findFileMetadata checks if the file is present in the result and returns the
// relevant metadata.
func findFileMetadata(data []fileMetadata, path string) fileMetadata {
	for _, v := range data {
		if v.Path == path {
			return v
		}
	}
	return fileMetadata{}
}
