import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import Styled from "styled-components";
import { MainContext } from "../app";
import LoginGithub from "react-login-github";

/**
 *
 * @ returns the login form and requests access to Github,
 *   Github redirects back to your app with a code parameter.
 */
export default function GithubLogin() {
  const { state, dispatch } = useContext(MainContext);
  const [dataLoaded, setData] = useState({ error: "", isDataLoading: false });
  const [githubCode, setGithubCode] = useState("");
  const { client_id, redirect_uri, proxy_url } = state;

  // fetch the data received from the backend
  const fetchData = (options) => {
    fetch(proxy_url, options)
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: "LOGIN",
          payload: { githubResponse: data, isAuthenticated: true },
        });
      })
      .catch((err) => {
        console.log(err);
        setData({
          error: "Login failed: " + err,
          isDataLoading: false,
        });
      });
  };
  useEffect(() => {
    if (githubCode !== "") {
      setData(data => ({ ...data, isDataLoading: true }));
      const options = {
        method: "POST",
        body: JSON.stringify({
          code: githubCode,
        }),
      };
      fetchData(options);
    }
  }, [githubCode]);

  if (state.isAuthenticated) {
    return <Redirect to="/" />;
  }
  const onSuccess = (response) => {
    if (response) {
      setGithubCode(response.code);
      setData({ ...dataLoaded, error: "" });
    }
  };
  const onFailure = (response) => {
    console.error(response);
    setData({
      isDataLoading: false,
      error: "Login failed: " + response,
    });
  };

  return (
    <Wrapper>
      <div>
        <h1>Welcome To Threedy</h1>
        <span>Github Integration</span>
        <span>{dataLoaded.error}</span>

        {dataLoaded.isDataLoading ? (
          <div className="spiner-container">
            <div className="spiner"></div>
          </div>
        ) : (
          <LoginGithub
            clientId={client_id}
            redirectUri={redirect_uri}
            scope={"repo,user"}
            onSuccess={onSuccess}
            onFailure={onFailure}
            buttonText="LOGIN WITH GITHUB"
            className="GithubLogin"
          />
        )}
      </div>
    </Wrapper>
  );
}
const Wrapper = Styled.section`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      height: 45%;
      > h1 {
        font-size: 2rem;
        color: white;
        margin-bottom: 20px;
      }
      > span:nth-child(2) {
        font-size: 1.1rem;
        color: #00ffac;
        margin-bottom: 70px;
      }
      > span:nth-child(3) {
        margin: 10px 0 20px;
        color: red;
      }
    }
    .spiner-container {
      display: flex;
      justify-content: center;
      align-items: center;          
      height: 40px;
    }
    .spiner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      animation: spin 2s linear infinite;
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .GithubLogin {
      background-color: #caced30f !important;
      width: 20vw;
      margin-bottom: 10px;
      height: 4.5vh;
      margin-bottom: 10px;
      color: #eaebed;
    
      /* font-family:Verdana !important; */
      font-weight: 600 !important;
      border-color: #caced30f !important;
      border-radius: 25px !important;
      border: 0px !important;
      font-size: 0.9vw !important;
    }
`;
