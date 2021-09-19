var admin = require('firebase-admin');
var serviceAccount = require('../../pinnacle-sms-01-firebase-adminsdk-qul18-1aa13f4e1c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
