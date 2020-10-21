import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
//import './Chat.css'

const socket = io.connect('http://localhost:4000')

function Chat() {
  const [state, setState] = useState({ message: '', name: '' })

  // Array of objects with message and name
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }])
    })
  })

  const onTextChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const onMessageSubmit = e => {
        // prevent messages from clearing if refreshed
        e.preventDefault()
        const { name, message } = state
        socket.emit('message', { name, message })

        // set state back to empty message while keeping the name
        setState({ message: '', name })
  }

  // renderChat function with jsx output
  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ))
  }

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
      <h1>Message</h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={e => onTextChange(e)}
            value={state.name}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={e => onTextChange(e)}
            value={state.message}

            // material ui
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  )
}

export default Chat;