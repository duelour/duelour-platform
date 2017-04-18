const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

const acceptChallengeForPlayer = require('./handlers/accept-challenge-for-player');
const createChallengeForPlayer = require('./handlers/create-challenge-for-player');
const validateFirebaseIdToken = require('./utils/validate-firebase-token');

admin.initializeApp(functions.config().firebase);

const handleRequest = next => (req, res) => {
  cors(req, res, () => {
    validateFirebaseIdToken(req, res, decodedToken => {
      next({ req, res }, { decodedToken });
    });
  });
};

exports.acceptChallengeForPlayer = functions.https.onRequest(
  handleRequest(acceptChallengeForPlayer)
);

exports.createChallengeForPlayer = functions.https.onRequest(
  handleRequest(createChallengeForPlayer)
);
