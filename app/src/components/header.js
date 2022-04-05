import { AppBar, Toolbar } from "@material-ui/core";
import React, { useContext, useMemo } from "react";
import Styled from "styled-components";
import { MainContext } from "../app";

/**
 *
 * @ returns the header items and the logo
 */
const Header = () => {
  const { state, dispatch } = useContext(MainContext);

  const displayHeader = useMemo(() => {
    return (
      <Toolbar>
        <img className="logo" alt="" src="/i3dhub-logo.png"></img>
        <span style={{ color: "white" }}> Github Integration |</span>
        <a href={"/"} className="button">
          {"Home"}
        </a>
        {state.isAuthenticated ? (
          <a href={"/repository"} className="button">
            {"Repository"}
          </a>
        ) : (
          <a className="button" href="/login">
            {"Repository"}
          </a>
        )}
        {state.isAuthenticated ? (
          <a className="button" href="/login" onClick={() => handleLogout()}>
            Logout
          </a>
        ) : (
          <a className="button" href="/login">
            Login
          </a>
        )}
      </Toolbar>
    );
  }, [state]);

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <Wrapper>
      <header>
        <AppBar>{displayHeader}</AppBar>
      </header>
    </Wrapper>
  );
};

const Wrapper = Styled.div`
.MuiToolbar-regular {
  min-height: 64px;
  background-color: #091227;
}

.logo {
  display: block;
  position: relative;
  z-index: 11;
  top: 2px;
  left: -12px;
  height: auto;
  width: 8%;
}

.button,.logout {
  -webkit-appearance: button;
  -moz-appearance: button;
  appearance: button;
  text-decoration: none;
  color: inherit;
  margin: 11px;
}
`;
export default Header;
