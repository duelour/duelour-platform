const admin = require('firebase-admin');

const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>'
    );
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      console.log('ID Token correctly decoded', decodedToken);
      req.user = decodedToken;
      next(decodedToken);
    })
    .catch(err => {
      console.error('Error while verifying Firebase ID token:', err);
      res.status(403).send('Unauthorized');
    });
};

module.exports = validateFirebaseIdToken;
