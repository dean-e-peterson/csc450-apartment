import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Social from '../pages/Social';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function Footer(props) {
  const classes = useStyles();
  return (
    <AppBar position='fixed' color='primary' className={classes.appBar}>
      <Toolbar position='static'>
        <div className={classes.grow} />
        <Social authUser={props.authUser} />
      </Toolbar>
    </AppBar>
  );
}
