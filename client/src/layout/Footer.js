import React from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core';
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
  copyright: {
    paddingRight: '15px',
  },
}));

export default function Footer({ authUser }) {
  const classes = useStyles();
  return (
    <AppBar position='static' color='primary' className={classes.appBar}>
      <Toolbar position='static'>
        <Grid container direction='row' alignItems='center'>
          <Grid item xs={8}>
            <Typography className={classes.copyright}>
              &copy; {1900 + new Date().getYear()} CSC450 Group 5: Dean
              Peterson, Adrian Jackson, Andrew Nielsen
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Social authUser={authUser} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
