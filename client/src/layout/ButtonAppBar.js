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

const ButtonAppBar = ({ authUser, setAuthUser }) => {
  const classes = useStyles();
  const history = useHistory();
  
  const onLogout = () => {
    setAuthUser(null);
    localStorage.removeItem("token");
    // Back to homepage in case user no longer has rights to where they were.
    history.push("/");
  };

  // Choose buttons to display based on permissions of logged on user.
  let buttons;
  if (!authUser) { // Not logged in.
    buttons = (
      <Fragment>
        <Button color='inherit' component={Link} to="/login">Login</Button>
        <Button color='inherit' component={Link} to="/register">Register</Button>
        <Button color='inherit'>Chat</Button>
      </Fragment>
    );
  } else if (authUser.isStaff) { // Logged in as staff.
    buttons = (
      <Fragment>
        <Button color='inherit' onClick={onLogout}>Logout</Button>
        <Button color='inherit'>Chat</Button>
        <Button color='inherit'>Staff</Button>
      </Fragment>
    );
  } else if (authUser.unit) { // Logged in as tenant.
    buttons = (
      <Fragment>
        <Button color='inherit' onClick={onLogout}>Logout</Button>
        <Button color='inherit'>Chat</Button>
        <Button color='inherit'>Tenant</Button>        
      </Fragment>
    );
  } else { // Logged in as but not as tenant or staff.
    buttons = (
      <Fragment>
        <Button color='inherit' onClick={onLogout}>Logout</Button>
        <Button color='inherit'>Chat</Button>
      </Fragment>
    );
  }

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
        {buttons}
      </Toolbar>
    </AppBar>
  );
};

export default ButtonAppBar;