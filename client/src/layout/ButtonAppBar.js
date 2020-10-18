import React, { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,  
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
}));

// Choose buttons to display based on permissions of logged on user.
const Buttons = (authUser, setAuthUser) => {
  const history = useHistory();

  const onLogout = () => {
    setAuthUser(null);
    localStorage.removeItem("token");
    // Back to homepage in case user no longer has rights to where they were.
    history.push("/");
  };

  if (!authUser) { // Not logged in.
    return (
      <Fragment>
        <Button color='inherit' component={Link} to="/login">Login</Button>
        <Button color='inherit'>Register</Button>
        <Button color='inherit'>Chat</Button>
      </Fragment>
    );
  } else { // Logged in.
    return (
      <Fragment>
        <Button color='inherit' onClick={onLogout}>Logout</Button>
        <Button color='inherit'>Chat</Button>
      </Fragment>
    );
  }
};

const ButtonAppBar = ({ authUser, setAuthUser }) => {
  const classes = useStyles();  
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography
          style={{ textAlign: "Center" }}
          variant='h4'
          component='h1'
          className={classes.title}
        >
          Sunshine Apartments
        </Typography>
        {Buttons(authUser, setAuthUser)}
      </Toolbar>
    </AppBar>
  );
};

export default ButtonAppBar;