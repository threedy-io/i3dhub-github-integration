import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Styled from "styled-components";
import { MainContext } from "../app";

/**
 *
 * @ returns some information related to the github account
 *  such as the avatar  , the user name and the followers
 */
export default function Home() {
  const { state } = useContext(MainContext);

  // redirect to the login page if the user is not logged in 
  if (!state.isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // get the relevant data from the response
  const { avatar_url, name, public_repos, followers, following } =
      state.githubResponse.data;

  return (
    <Wrapper>
      <div className="container">
        <div>
          <div className="github-content">
            <img src={avatar_url} alt="Avatar" />
            <span>{name}</span>
            <span>{public_repos} Repos</span>
            <span>{followers} Followers</span>
            <span>{following} Following</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = Styled.section`
.container{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  >div{
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    .github-content{
      display: flex;
      flex-direction: column;
      padding: 20px 100px;    
      background-color: inherit;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      width: auto;
  
      img{
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
      >span{
        color: #00FFAC !important;
      }
      >span:nth-child(2){
        margin-top: 20px;
        font-weight: bold;
      }
  
      >span:not(:nth-child(2)){
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
`;
