import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ButtonAppBar from "./layout/ButtonAppBar";
import Homepage from "./pages/Homepage";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Users from "./pages/Users";
import Calendar from "./pages/Calendar";
import Apply from "./pages/Apply";
import { checkAuthToken } from "./utils/auth";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Raleway", "sans-serif"].join(",")
  }
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
          <Route exact path='/'>
            <Homepage />
          </Route>
          <Route exact path='/login'>
            <Login setAuthUser={setAuthUser} />
          </Route>
          <Route exact path='/register'>
            <Register setAuthUser={setAuthUser} />
          </Route>
          <Route exact path='/chat'>
            <Chat />
          </Route>
          {authUser && authUser.unit && // Must be tenant for this route.
            <Route exact path="/posts">
              <Posts authUser={authUser}/>
            </Route>
          }
          {authUser && authUser.isStaff && // Must be staff for this route.
            <Route exact path="/users"> 
              <Users authUser={authUser}/>
            </Route>
          }
          <Route exact path='/calendar'>
            <Calendar authUser={authUser} setAuthUser={setAuthUser} />
            {/* {" "} */}
            {/* TODO: authenticate route */}
          </Route>          
          <Route exact path="/apply">
            {authUser ?
              <Apply authUser={authUser}/>
            :
              <Redirect to="/register" />
            }
          </Route>          
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
