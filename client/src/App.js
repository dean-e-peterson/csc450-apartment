import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ButtonAppBar from "./layout/ButtonAppBar";
import Homepage from './pages/Homepage';
import Login from "./pages/Login";
import { checkAuthToken } from "./utils/auth";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Raleway",
      "sans-serif",
    ].join(","),
  },
});

const App = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await checkAuthToken(token);
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      } catch (err) {
        setAuthUser(null);
      }
    };
    handleAuth();
  }, []); // [] means don't run on every render.

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ButtonAppBar authUser={authUser} setAuthUser={setAuthUser} />
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/login">
            <Login setAuthUser={setAuthUser} />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;