// Express Server Settings
import { db } from './firebase';
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
var crypto = require('crypto');
var argon2 = require('argon2');
var StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// Routes
const routes = require('./routes');

// Inspired from Zeeshan Hassan Memon on stackoverflow
const encryptSecret = async (text, pin) => {
  const hash = crypto.scryptSync(pin, 'salt', 32);
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(hash, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decypherSecret = async (text, pin) => { 
  const hash = crypto.scryptSync(pin, 'salt', 32);
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(hash, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]).toString();
  return decrypted;
}

const users = db.collection('users');

async function addUser(phone, name, privateKey, publicKey) {  
  try {
    await users.doc(phone).set({name: name, secret: privateKey, publicKey: publicKey});
  } catch (e) {
    throw e;
  }
  return true;
}

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

app.post('/api/recieveMessage', async (req, res) => {
  const twiml = new MessagingResponse();
  const body_array = req.body.Body.split(' ');
  const phone_number = req.body.From;

  if (body_array[1] == 'create') {
    const message = twiml.message();

    // TODO: Validate pin and name
    const pin = body_array[3];
    const name = body_array[4];

    // Generate and validate keys
    const pair = StellarSdk.Keypair.random();
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(
          pair.publicKey()
        )}`
      );
      await response.json();
    } catch (e) {
      console.log(e);
      message.body('Error please check your command and try again!');
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    }

    // Create user
    try {
      const privateKey = await encryptSecret(pair.secret(), pin);
      await addUser(phone_number, name, privateKey, pair.publicKey());
      message.body('You finally are part of the crypto');
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    } catch (e) {
      console.log(e);
      message.body('Error please check your command and try again!');
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    }
  } else if (
    body_array.length < 5 &&
    body_array[0] == 'twiller' &&
    body_array[1] == 'send' &&
    !sNaN(body_array[2]) &&
    body_array[3] == 'to' &&
    regex.test(body_array[4])
  ) {
    // Stellar Transaction
    var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    //Get it from firebase based on the sender's phone number
    var sourceKeys = StellarSdk.Keypair.fromSecret(
      'SB5LGTNFX3X34FCP2PXSS6KD5KZ36LRXHWP6BYU5E3R32MC7M5QHMIKH'
    );

    //Get it from firebase based on the given phone number
    var destinationId =
      'GCCFSH4N6BFMN3NBILKWHYRMMSRSMVPBABHHTXYJJUWCCUUHJTOLVTUU';

    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    var transaction;

    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    server
      .loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(function (error) {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new Error('The destination account does not exist!');
        } else return error;
      })
      // If there was no error, load up-to-date information on your account.
      .then(function () {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(function (sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationId,
              // Because Stellar allows transaction in many currencies, you must
              // specify the asset type. The special "native" asset represents Lumens.
              asset: StellarSdk.Asset.native(),
              amount: '10',
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text('Test Transaction'))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(180)
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then(function (result) {
        message.body('Success!! You sent your friend money');
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      })
      .catch(function (error) {
        console.error('Something went wrong!', error);
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
        message.body('Error please check your command and try again');
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      });
  } else {
    message.body('Error please check your command and try again');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
