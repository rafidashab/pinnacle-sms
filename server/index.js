// server/index.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { database, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCeY6KmK0Oho9kADIr0tkJrrFM4jYY2eI",
  authDomain: "pinnacle-sms.firebaseapp.com",
  projectId: "pinnacle-sms",
  storageBucket: "pinnacle-sms.appspot.com",
  messagingSenderId: "91844678856",
  appId: "1:91844678856:web:e142989d731df9e18b81fd",
  measurementId: "G-JG3V7MZ5FJ"
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app1);
const database = database();
const routes = require("./routes")
const express = require("express");

const accountSid = 'AC2db336d0cad3f0482b3bbf3efbcc6fd3';
const authToken = 'c6cf26e1fc073d1ae8db416124944fce';
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use("/api/", routes);
const PORT = process.env.PORT || 3003;

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
