import React, { useContext, useState, useEffect, useCallback } from "react";
import Styled from "styled-components";
import Repo from "./repo";
import SplitPane from "react-split-pane";
import { MainContext } from "../app";
import AttachWebvis from "./attachWebvis";

/**
 *
 * @ returns the instant3dhub and a list of files stored in the private repository
 */
const Repository = () => {
  const { state } = useContext(MainContext);
  const [repos, setRepos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [context, setContext] = useState(undefined);

  const handleLoad = async () => {

    // wait until the context and viewer objects are created
    const webvisComponent = document.querySelector('webvis-viewer');
    const context = await webvisComponent.requestContext();
    setContext(context);

  };

  useEffect(() => {

    window.addEventListener("load", handleLoad);

  }, []);

  const getRepos = useCallback(() => {
    const repositoryName = process.env.REACT_APP_REPOSITORY_NAME;

    if (owner !== "") {
      const repoUrl = `https://api.github.com/repos/${owner}/${repositoryName}/contents/`;

      const requestOptions = {
        method: "GET",
        headers: { Authorization: `token ${token}` },
      };

      fetch(repoUrl, requestOptions)
        .then((responses) => responses.json())
        .then((responses) => {
          setRepos(responses);
        })
        .catch((error) => {
          console.log(`inside getrepos error: ${error}`);
          setErrorMessage(error.response.statusText);
        });
    }
  }, [owner, token]);

  useEffect(() => {
    setToken(state.githubResponse.token);
    setOwner(state.githubResponse.data.login);
    getRepos();

    // Pass the Authorization token to webvis
    if (context && token) {
      context.changeSetting("additionalRequestHeaders", {
        Authorization: `Bearer ${token}`,
      });
    }

  }, [state.isAuthenticated, state.githubResponse.data.login, token, context]);

  const displayRepos = useCallback(() => {
    return repos.map((repo, index) => (
      <div key={repo.name} className={"file-list-item"}>
        <Repo
          key={repo.name}
          name={repo.name}
          owner={state.githubResponse.data.login}
        />
      </div>
    ));
  }, [repos, state.githubResponse.data.login]);

  return (
    <Wrapper>
      <SplitPane split="vertical" defaultSize="80%" primary="second">
        <FileList>
          <h4>
            File List From Repository {process.env.REACT_APP_REPOSITORY_NAME} :
          </h4>
          <br></br>
          {repos.length > 0 ? displayRepos() : <div>No data available</div>}
          {repos && <div>{errorMessage}</div>}
        </FileList>
        <VisView>
          <AttachWebvis />
          <webvis-tree viewer="viewer" ></webvis-tree>
          <webvis-viewer viewer="viewer" context="default_context"></webvis-viewer>
        </VisView>
      </SplitPane>
    </Wrapper>
  );
};

export default Repository;

const FileList = Styled.div`
  color: #00FFAC !important;
  border-collapse: collapse;
  padding: 9px;
  margin: 23px;
  position: relative;
  top: 168px;
  left: 6px;
  height: 90%;
  width: 450px;
file-list-item {
  margin-bottom: 19px;
  display: table;
}
`;
const VisView = Styled.div`
width: 95%;
position: absolute;
top: 66px;
height: 93%;
left: 10px;
webvis-tree {
  position: absolute;
  left: 12px;
  top: 180px;
  height: calc(100% - 310px);
  min-width: 249px;
  z-index: 3;
  transition: height .3s ease-in-out,transform .3s ease-in-out;
  width: 247px;
  pointer-events :none;
}

webvis-viewer {
  background: var(--color-secondary);    }
webvis-branding-label {
  display: none;
}      
`;
const Wrapper = Styled.div`
  h4{
    color: #00FFAC
  }
  
  /* Resize screen */
  .Resizer {
    background: white;
    opacity: 1;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  
  }
  
  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }
  
  
  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgb(231 232 234);
    border-right: 5px solid rgb(231 232 234);
    cursor: col-resize;
  }

 
`;
