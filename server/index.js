// Express Server Settings
import { db } from './firebase';
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

var StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

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

// Stellar Create Account

// The SDK does not have tools for creating test accounts, so you'll have to
// make your own HTTP request.

// if you're trying this on Node, install the `node-fetch` library and
// uncomment the next line:

// create a completely new and unique pair of keys
// see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
// const pair = StellarSdk.Keypair.random();

// pair.secret();
// // SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
// pair.publicKey();
// // GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB

// (async () => {
//   try {
//     const response = await fetch(
//       `https://friendbot.stellar.org?addr=${encodeURIComponent(
//         pair.publicKey(),
//       )}`,
//     );
//     const responseJSON = await response.json();
//     console.log("SUCCESS! You have a new account :)\n", responseJSON);
//   } catch (e) {
//     console.error("ERROR!", e);
//   }
// })();


// // Stellar Transaction
// var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// //Get it from firebase
// var sourceKeys = StellarSdk.Keypair.fromSecret(
//   'SB5LGTNFX3X34FCP2PXSS6KD5KZ36LRXHWP6BYU5E3R32MC7M5QHMIKH'
// );

// //Get it from firebase
// var destinationId = 'GCCFSH4N6BFMN3NBILKWHYRMMSRSMVPBABHHTXYJJUWCCUUHJTOLVTUU';

// Transaction will hold a built transaction we can resubmit if the result is unknown.
// var transaction;

// // First, check to make sure that the destination account exists.
// // You could skip this, but if the account does not exist, you will be charged
// // the transaction fee when the transaction fails.

// server
//   .loadAccount(destinationId)
//   // If the account is not found, surface a nicer error message for logging.
//   .catch(function (error) {
//     if (error instanceof StellarSdk.NotFoundError) {
//       throw new Error('The destination account does not exist!');
//     } else return error;
//   })
//   // If there was no error, load up-to-date information on your account.
//   .then(function () {
//     return server.loadAccount(sourceKeys.publicKey());
//   })
//   .then(function (sourceAccount) {
//     // Start building the transaction.
//     transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
//       fee: StellarSdk.BASE_FEE,
//       networkPassphrase: StellarSdk.Networks.TESTNET,
//     })
//       .addOperation(
//         StellarSdk.Operation.payment({
//           destination: destinationId,
//           // Because Stellar allows transaction in many currencies, you must
//           // specify the asset type. The special "native" asset represents Lumens.
//           asset: StellarSdk.Asset.native(),
//           amount: '10',
//         })
//       )
//       // A memo allows you to add your own metadata to a transaction. It's
//       // optional and does not affect how Stellar treats the transaction.
//       .addMemo(StellarSdk.Memo.text('Test Transaction'))
//       // Wait a maximum of three minutes for the transaction
//       .setTimeout(180)
//       .build();
//     // Sign the transaction to prove you are actually the person sending it.
//     transaction.sign(sourceKeys);
//     // And finally, send it off to Stellar!
//     return server.submitTransaction(transaction);
//   })
//   .then(function (result) {
//     console.log('Success! Results:', result);
//   })
//   .catch(function (error) {
//     console.error('Something went wrong!', error);
//     // If the result is unknown (no response body, timeout etc.) we simply resubmit
//     // already built transaction:
//     // server.submitTransaction(transaction);
//   });

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
