const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formateMsgs = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    // welcome current user
    socket.emit("message", formateMsgs(botName, `welcome ${user.username}`));
    // Runs and send data from one user to all except sender
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formateMsgs(botName, ` ${user.username} has joined to chat`)
      );

    // send users and room info to display on UI
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  console.log(`socket.io connection established mostafa kadry`);

  //  chat messages
  socket.on("chatMsg", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formateMsgs(user.username, msg));
  });

  // Runs when the user is not connect 38min : 40 sec
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formateMsgs(botName, ` ${user.username} has left the chat`)
      );

      // send users and room info to display on UI
      socket.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
server.listen(PORT, () => console.log("listening on port " + PORT));
