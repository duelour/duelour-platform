const { database } = require('./firebase');

exports.setPlayerWithPriority = (
  playerKey,
  path,
  body,
  priority = 0 - Date.now()
) => {
  return new Promise((resolve, reject) => {
    if (!playerKey) {
      reject(new Error('playerKey not provided!'));
      return null;
    }
    if (!path) {
      reject(new Error('path not provided!'));
      return null;
    }
    if (!body) {
      reject(new Error('body not provided!'));
      return null;
    }

    database()
      .child(`players/${playerKey}/${path}`)
      .setWithPriority(body, priority, err => {
        if (err) {
          reject(new Error(err));
        }
      })
      .then(() => resolve({}))
      .catch(err => reject(err));
  });
};
