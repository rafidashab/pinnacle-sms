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


var bodyParser = require('body-parser')

const PORT = process.env.PORT || 3003;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

  app.use("/api/", routes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
