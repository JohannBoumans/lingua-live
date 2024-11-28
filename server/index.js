require("dotenv").config();

const { ExpressPeerServer } = require("peer");
const express = require("express");
const cors = require("cors");

const http = require("http");

const app = express();

const server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello world!");
});

const PORT = 9000;

app.use(express.static("public"));

const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true,
});

app.use("/stream", peerServer);

server.listen(PORT, () => {
  console.log(`PeerJS server running on port ${PORT}`);
});
















// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);

// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// app.get('/', (req, res) => {
//   res.send('Server is running');
// });

// io.on('connection', (socket) => {
//   socket.on('join-room', ({ roomId, userId, metadata }) => {
//     socket.join(roomId);
//     socket.to(roomId).emit('user-connected', { userId, metadata });

//     socket.on('disconnect', () => {
//       socket.to('roomId').emit('user-disconnected', userId);
//     });
//   });
// });

// const PORT = process.env.PORT || 5001;

// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
