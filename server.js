const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const { addUser, removeUser, getUser } = require('./users');

/*
Error: You are trying to attach socket.io to an express request
handler function. Please pass a http.Server instance.
*/

// Create http server instance
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Run this connection when the user connects
io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    // Welcome the user to the room with an automatic Chatbot message
    socket.emit('message', {
      user: 'Chatbot',
      text: `${user.name}, welcome to the chat.`,
    });

    // Broadcast this message to the room
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'Chatbot', text: `${user.name} has joined!` });

    callback();
  });

  // Listen for sendMessage from the client side
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    // emit message back to the client side
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  // Listen for disconnect from the client side
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    // emit message back to the client side
    if (user) {
      io.to(user.room).emit('message', {
        user: 'Chatbot',
        text: `${user.name} has left.`,
      });
    }
  });
});

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/units', require('./routes/api/units'));
app.use('/api/requests', require('./routes/api/requests'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/social', require('./routes/api/social'));
app.use('/api/locations', require('./routes/api/locations'));
app.use('/api/applications', require('./routes/api/applications'));
app.use('/api/calendar', require('./routes/api/calendar'));
app.use('/api/alerts', require('./routes/api/alerts'));

// Serve static assets in production
if ((process.env.NODE_ENV = 'production')) {
  // Set our static public folder with express
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
