import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Notification from './Notification';

//const socket = io.connect('http://localhost:4000');
const socket = io.connect('https://safe-wildwood-18697.herokuapp.com/');

const useStyles = makeStyles({
  root: {
    maxWidth: 450,
  },
  text: {
    padding: '5px',
  },
  input: {
    maxWidth: 400,
  },
  send: {
    padding: '10px',
  },
});

export default function Chat({ open, setOpen }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState('');
  //const [open, setOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    // Get the name and room from the URL string
    const { name, room } = queryString.parse(window.location.search);

    setRoom(room);
    setName(name);

    // emit the join to the server
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // listen for the notification emit from the server
    socket.on('notification', (notification) => {
      setNotification(notification);
    });

    // listen for the message emit from the server
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  // setOpen to open the snackbar notification
  //setOpen(true);

  function onMessageSubmit(e) {
    e.preventDefault();

    // Emit message to the server
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  // Set the message to the value entered
  const onTextChange = (e) => {
    setMessage(e.target.value);
  };

  // Click away to get rid of the notification
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onJoin = (e) => {
    setName('Staff');
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  };

  const action = (
    <Button onClick={onJoin} color='primary' size='small'>
      Enter Chat Room
    </Button>
  );

  // Map throught the messages using index i
  const Messages = ({ messages, name }) => {
    return messages.map((message, i) => (
      <div key={i}>
        <div className={classes.text} message={message} name={name}>
          {message.user + ':' + ' ' + message.text}
        </div>
      </div>
    ));
  };

  // Function allowing the user to press the Enter key
  const onEnter = (e) => {
    if (e.key === 'Enter' ? onMessageSubmit(e) : null);
  };

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography variant='h4' gutterBottom>
          Messages:
        </Typography>
        <Messages messages={messages} name={name} />
        <Notification
          open={open}
          notification={notification.user + ':' + ' ' + notification.text}
          onClose={handleClose}
          action={action}
        />
      </CardContent>
      <CardContent className={classes.input}>
        <TextField
          id='outlined-multiline-static'
          multiline
          rows={4}
          type='text'
          placeholder='Type a message...'
          variant='outlined'
          value={message}
          onChange={onTextChange}
          onKeyPress={onEnter}
        ></TextField>
      </CardContent>
      <CardContent className={classes.send}>
        <Button
          onClick={onMessageSubmit}
          variant='contained'
          color='primary'
          endIcon={<SendIcon>send</SendIcon>}
        >
          Send
        </Button>
      </CardContent>
    </Card>
  );
}
