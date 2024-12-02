require("dotenv").config();
const { ExpressPeerServer } = require("peer");
const express = require("express");
const cors = require("cors");
const http = require("http");
const speech = require('@google-cloud/speech');

const app = express();
const server = http.createServer(app);

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
console.log(credentials, 'CREDENTIALS')
// Configuration Google Cloud Speech
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   credentials,
});

// Configuration PeerJS avec gestion des événements de données
const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true,
  proxied: true,
  corsOptions: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Stockage des streams de transcription pour chaque peer
const transcriptionStreams = new Map();

// Gestion des événements PeerJS
peerServer.on('connection', (client) => {
  console.log(`Client connected: ${client.getId()}`);
  
  // Créer un nouveau stream de transcription pour ce client
  const recognizeStream = speechClient
    .streamingRecognize({
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: 'fr-FR',
      },
      interimResults: true,
    })
    .on('error', (error) => {
      console.error(`Erreur de transcription pour ${client.getId()}:`, error);
    })
    .on('data', (data) => {
      // Envoyer la transcription au client via un message de données PeerJS
      client.send({
        type: 'transcription',
        transcription: data.results[0].alternatives[0].transcript,
        isFinal: data.results[0].isFinal
      });
    });

  transcriptionStreams.set(client.getId(), recognizeStream);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client disconnected: ${client.getId()}`);
  
  // Nettoyer le stream de transcription
  const recognizeStream = transcriptionStreams.get(client.getId());
  if (recognizeStream) {
    recognizeStream.end();
    transcriptionStreams.delete(client.getId());
  }
});

// Gestion des messages audio pour la transcription
peerServer.on('message', (client, message) => {
  if (message.type === 'audioData') {
    const recognizeStream = transcriptionStreams.get(client.getId());
    if (recognizeStream) {
      recognizeStream.write(message.data);
    }
  }
});

app.use(cors({
    origin: '*'
}));

app.use("/stream", peerServer);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`PeerJS server running on port ${PORT}`);
});










// require("dotenv").config();

// const { ExpressPeerServer } = require("peer");
// const express = require("express");
// const cors = require("cors");

// const http = require("http");

// const app = express();

// const server = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello world!");
// });

// const PORT = process.env.PORT || 8080;

// app.use(express.static("public"));

// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   allow_discovery: true,
// //   port: PORT,
//   proxied: true,
//   corsOptions: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });

// app.use(cors({
//     origin: '*'
// }))

// app.use("/stream", peerServer);

// server.listen(PORT, () => {
//   console.log(`PeerJS server running on port ${PORT}`);
// });















// require("dotenv").config();

// const { ExpressPeerServer } = require("peer");
// const express = require("express");
// const cors = require("cors");

// const http = require("http");

// const app = express();

// const server = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello world!");
// });

// const PORT = process.env.PORT || 8080;

// app.use(express.static("public"));

// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   allow_discovery: true,
// //   port: PORT,
//   proxied: true,
//   corsOptions: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });

// app.use(cors({
//     origin: '*'
// }))

// app.use("/stream", peerServer);

// server.listen(PORT, () => {
//   console.log(`PeerJS server running on port ${PORT}`);
// });
