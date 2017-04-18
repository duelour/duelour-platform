const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')();

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

exports.createChallengeForPlayer = functions.https.onRequest(
  handleRequest(createChallengeForPlayer)
);
