import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import uuidv4 from 'uuid/v4';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 15,
  },
  text: {
    text: 'strong',
  },
  spacing: {
    padding: theme.spacing(2),
  },
  send: {
    edge: 'end',
    paddingLeft: 15,
  },
}));

export default function Join({ setOpen }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const classes = useStyles();

  const onChangeHandler = (e) => {
    setName(e.target.value);
    setRoom(uuidv4());
  };

  const onClickHandler = (e) => {
    if (!name ? e.preventDefault() : null);
    setOpen(true);
  };

  return (
    <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      spacing={3}
      className={classes.root}
    >
      <Grid item xs={3} className={classes.spacing}>
        <Typography className={classes.text} variant='h5' gutterBottom>
          Enter Name:
        </Typography>
      </Grid>
      <Grid item xs={3} className={classes.spacing}>
        <TextField
          onChange={onChangeHandler}
          edge='start'
          name='name'
          color='primary'
          id='outlined-multiline-static'
          variant='outlined'
          label='Name'
        />
      </Grid>
      <Grid item xs={3} className={classes.spacing}>
        <Link onClick={onClickHandler} to={`/chat?name=${name}&room=${room}`}>
          <Button variant='contained' color='primary'>
            Enter Room
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}
