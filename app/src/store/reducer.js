export const initialState = {
  github_repository: process.env.REACT_APP_REPOSITORY_NAME,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_id: process.env.REACT_APP_CLIENT_ID,
  proxy_url: process.env.REACT_APP_PROXY_URL,
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  githubResponse: JSON.parse(localStorage.getItem("githubResponse")) || null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(action.payload.isAuthenticated)
      );
      localStorage.setItem("githubResponse", JSON.stringify(action.payload.githubResponse));
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        githubResponse: action.payload.githubResponse,
      };
    }
    case "LOGOUT": {
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        githubResponse: null,
      };
    }
    default:
      return state;
  }
};
