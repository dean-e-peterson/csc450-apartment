import React from 'react';
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

const ButtonAppBar = () => {
  const classes = useStyles();  
  return (
    <AppBar position='static'>
      <Toolbar>
        <Button color='inherit'>Logout</Button>
        <Typography
          style={{ textAlign: "Center" }}
          variant='h6'
          component='h1'
          className={classes.title}
        >
          Apartments
        </Typography>
        <Button color='inherit'>Login</Button>
        <Button color='inherit'>Register</Button>
        <Button color='inherit'>Chat</Button>
      </Toolbar>
    </AppBar>
  );
};

export default ButtonAppBar;