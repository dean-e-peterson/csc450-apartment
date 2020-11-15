const express = require('express');
const connectDB = require('./config/db');

const app = express();

/*
Error: You are trying to attach socket.io to an express request
handler function. Please pass a http.Server instance.
*/

// Create http server instance
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message });
  });
});

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/units', require('./routes/api/units'));
app.use('/api/requests', require('./routes/api/requests'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/social', require('./routes/api/social'));
app.use('/api/locations', require('./routes/api/locations'));
app.use('/api/applications', require('./routes/api/applications'));
app.use('/api/alerts', require('./routes/api/alerts'));

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
