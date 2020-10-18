import React, { Fragment } from "react";
import { Link } from "react-router-dom";
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
const Buttons = (authUser) => {
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
        <Button color='inherit'>Logout</Button>
        <Button color='inherit'>Chat</Button>
      </Fragment>
    );
  }
};

const ButtonAppBar = ({ authUser }) => {
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
        {Buttons(authUser)}
      </Toolbar>
    </AppBar>
  );
};

export default ButtonAppBar;