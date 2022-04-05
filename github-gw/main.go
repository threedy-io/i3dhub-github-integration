// Package main provides the server handling incoming requests and returning
// the appropriate responses from GitHub.
package main

import (
	"context"
	"flag"
	"git.threedy.io/hafedh.el.faleh/github-integration/github"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"strings"
)

// requestParams contains necessary parameters for talking to GitHub.
type requestParams struct {
	auth      string
	path      string
	repoName  string
	repoOwner string
}

// getParameters extracts the required parameters from the incoming request.
func getParameters(context *gin.Context) requestParams {
	return requestParams{
		auth:      context.Request.Header.Get("Authorization"),
		path:      strings.TrimPrefix(context.Param("path"), "/"),
		repoOwner: context.Param("owner-name"),
		repoName:  context.Param("repo-name"),
	}
}

// get handles the GET requests.
func get(ctx context.Context, w http.ResponseWriter, params requestParams) {
	reader, contentType, etag, err := github.New(params.repoName, params.repoOwner, params.auth).GetData(ctx, params.path)
	if err != nil {
		log.Printf("failed to handle request for %v/%v/%v: %v", params.repoOwner, params.repoName, params.path, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer reader.Close()

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("ETag", etag)
	w.WriteHeader(http.StatusOK)
	io.Copy(w, reader)
}

// head handles the HEAD requests.
func head(ctx context.Context, w http.ResponseWriter, params requestParams) {
	etag, err := github.New(params.repoName, params.repoOwner, params.auth).GetHash(ctx, params.path)
	if err != nil {
		log.Printf("failed to handle request for %v/%v/%v: %v", params.repoOwner, params.repoName, params.path, err)
		w.WriteHeader(http.StatusInternalServerError) // responses to head requests cannot have a body
		return
	}

	w.Header().Set("ETag", etag)
	w.WriteHeader(http.StatusOK)
}

func main() {
	// Set gin to release mode.
	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	router.GET("/githubFile/:owner-name/:repo-name/*path", func(ctx *gin.Context) {
		get(ctx, ctx.Writer, getParameters(ctx))
	})
	router.HEAD("/githubFile/:owner-name/:repo-name/*path", func(ctx *gin.Context) {
		head(ctx, ctx.Writer, getParameters(ctx))
	})

	// Get the host and port arguments.
	host := flag.String("host", "", "The host name")
	port := flag.String("port", "8090", "The port number")
	flag.Parse()

	// Start the server.
	if err := router.Run(*host + ":" + *port); err != http.ErrServerClosed {
		log.Fatalf("failed to run: %v", err)
	}
}
