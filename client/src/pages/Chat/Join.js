import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
  };

  //This is a temporary function for now
  const onChangeRoomHandler = (e) => {
    setRoom(e.target.value);
  };

  const onClickHandler = (e) => {
    if (!name || !room ? e.preventDefault() : null);
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
      <TextField
        onChange={onChangeRoomHandler}
        edge='start'
        name='room'
        color='primary'
        id='outlined-multiline-static'
        variant='outlined'
        label='Room'
      />
      <Link onClick={onClickHandler} to={`/chat?name=${name}&room=${room}`}>
        <Button variant='contained' color='primary'>
          Enter Room
        </Button>
      </Link>
    </Grid>
  );
}
