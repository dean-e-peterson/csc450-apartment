import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ButtonAppBar from "./layout/ButtonAppBar";
import Homepage from './homepage';
import Login from "./layout/login";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Raleway",
      "sans-serif",
    ].join(","),
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ButtonAppBar />
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;