const express = require("express");
const connectDB = require("./config/db");

const app = express();
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

/*
Error: You are trying to attach socket.io to an express request
handler function. Please pass a http.Server instance.
*/

// Create http server instance
const http = require("http").createServer(app);
const io = require("socket.io")(http);

<<<<<<< HEAD
// Run this connection when the user connects
io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'Chatbot',
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'Chatbot', text: `${user.name} has joined!` });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Chatbot',
        text: `${user.name} has left.`,
      });
    }
=======
io.on("connection", socket => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
>>>>>>> 3d7ccf0fa9033aa7faffe00cafb3404cdef727dd
  });
});

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/units", require("./routes/api/units"));
app.use("/api/requests", require("./routes/api/requests"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/social", require("./routes/api/social"));
app.use("/api/locations", require("./routes/api/locations"));
app.use("/api/applications", require("./routes/api/applications"));
app.use("/api/calendar", require("./routes/api/calendar"));

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
