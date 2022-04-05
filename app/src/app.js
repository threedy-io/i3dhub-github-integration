import React, { createContext, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/header";
import Home from "./components/home";
import GithubLogin from "./components/githubLogin";
import Repository from "./components/repository";
import { initialState, reducer } from "./store/reducer";

export const MainContext = createContext();

/**
 *
 * @ Controls the different routes and initializes the context
 */
 export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MainContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <div>
        <Header />
      </div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={GithubLogin} />
          <Route exact path="/repository" component={Repository} />
        </Switch>
      </Router>
    </MainContext.Provider>
  );
}


