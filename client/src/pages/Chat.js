import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
//import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//import Icon from '@material-ui/core/Icon';
import Notification from '../layout/Notification';
//import './Chat.css'

const socket = io.connect('http://localhost:4000');

export default function Chat() {
  const [state, setState] = useState({ message: '', name: '' });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });
  //const classes = useStyles();

  // Array of objects with message and name
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  });

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    // prevent messages from clearing if refreshed
    e.preventDefault();
    const { name, message } = state;
    socket.emit('message', { name, message });

    setNotify({
      isOpen: true,
      message: 'Chat has been initiated',
      type: 'info',
    });

    // set state back to empty message while keeping the name
    setState({ message: '', name });
  };

  // renderChat function with jsx output
  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className='card'>
      <form onSubmit={onMessageSubmit}>
        <h1>Message</h1>
        <div className='name-field'>
          <TextField
            name='name'
            onChange={(e) => onTextChange(e)}
            value={state.name}
            label='Name'
          />
        </div>
        <div>
          <TextField
            name='message'
            onChange={(e) => onTextChange(e)}
            value={state.message}
            // material ui
            id='outlined-multiline-static'
            variant='outlined'
            label='Message'
          />
        </div>
        <Button onClick={onMessageSubmit} variant='outlined' color='primary'>
          Send Message
        </Button>
      </form>
      <div className='render-chat'>
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
}
