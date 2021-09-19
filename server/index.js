// Express Server Settings
import { db } from './firebase';
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// Firebase Test
// const usersDb = db.collection('phone');
// const rafid = usersDb.doc('1');

// (async () => {
//   await rafid.set({
//     first: 'Rafid',
//   });
// })();

// get collection
// (async () => {
//   const users = await db.collection('users').get();
// })();

// Routes
const routes = require('./routes');

// Twilio
const accountSid = 'AC2db336d0cad3f0482b3bbf3efbcc6fd3';
const authToken = 'c6cf26e1fc073d1ae8db416124944fce';
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.get('/api/sendMessage', (req, res) => {
  client.messages
    .create({
      body: 'This is a test',
      messagingServiceSid: 'MGd82b096e04a0f637f37d18e8575cd9d2',
      to: '+12368676110',
    })
    .then((message) => res.json(message))
    .done();
});

app.post('/api/recieveMessage', (req, res) => {
  const twiml = new MessagingResponse();
  if (req.body.Body == 'hello') {
    const message = twiml.message();
    message.body('Shut the hell up');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
