import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { TextField, Grid, Typography, Paper, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';

//const socket = io.connect('http://localhost:4000');
const socket = io.connect('https://safe-wildwood-18697.herokuapp.com/');

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 15,
  },
  input: {
    padding: 15,
  },
  send: {
    edge: 'end',
    paddingLeft: 15,
  },
}));

export default function Chat() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    // Get the name and room from the URL string
    const { name, room } = queryString.parse(window.location.search);

    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, []);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const onMessageSubmit = (e) => {
    e.preventDefault();

    // Emit message to the server
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const onTextChange = (e) => {
    setMessage(e.target.value);
  };

  // Map throught the messages using index i
  const Messages = ({ messages, name }) => {
    return messages.map((message, i) => (
      <div key={i}>
        <div message={message} name={name}>
          {message.user + ':' + message.text}
        </div>
      </div>
    ));
  };

  // Function allowing the user to press the Enter key
  const onEnter = (e) => {
    if (e.key === 'Enter' ? onMessageSubmit(e) : null);
  };

  return (
    <Grid
      container
      direction='row'
      justify='center'
      alignItems='stretch'
      className={classes.root}
    >
      <AppBar room={room} />
      <Grid item xs={5}>
        <Paper square className={classes.paper} elevation={5}>
          <Typography className={classes.text} variant='h5' gutterBottom>
            Messages:
          </Typography>

          <Messages messages={messages} name={name} />
        </Paper>
      </Grid>

      <TextField
        className='input'
        type='text'
        placeholder='Type a message...'
        value={message}
        onChange={onTextChange}
        onKeyPress={onEnter}
      ></TextField>
      <SendIcon onClick={onMessageSubmit} className={classes.send}></SendIcon>
    </Grid>
  );
}
