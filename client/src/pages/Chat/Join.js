import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import uuidv4 from 'uuid/v4';
import addNotification from 'react-push-notification';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 15,
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    flexgrow: 1,
    color: '#90caf9',
  },
  send: {
    edge: 'end',
    paddingLeft: 15,
  },
}));

export default function Join() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const classes = useStyles();

  const onChangeHandler = (e) => {
    setName(e.target.value);
    setRoom(uuidv4());
  };

  const onClickHandler = (e) => {
    if (!name ? e.preventDefault() : null);
    addNotification({
      title: 'Chat alert',
      subtitle: 'User',
      message: 'A user has entered the chat',
      theme: 'darkblue',
      native: true,
    });
  };

  return (
    <Grid
      container
      direction='row'
      justify='center'
      alignItems='stretch'
      className={classes.root}
    >
      <Typography className={classes.text} variant='h5' gutterBottom>
        Enter Name:
      </Typography>

      <TextField
        onChange={onChangeHandler}
        edge='start'
        name='name'
        color='primary'
        id='outlined-multiline-static'
        variant='outlined'
        label='Name'
      />

      <Link onClick={onClickHandler} to={`/chat?name=${name}&room=${room}`}>
        <Button variant='contained' color='primary'>
          Enter Room
        </Button>
      </Link>
    </Grid>
  );
}
