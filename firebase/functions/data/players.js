const { database } = require('./firebase');

exports.setPlayerWithPriority = (
  playerKey,
  path,
  body,
  priority = 0 - Date.now()
) => {
  if (!playerKey) {
    throw new Error('playerKey not provided!');
  }
  if (!path) {
    throw new Error('path not provided!');
  }
  if (!body) {
    throw new Error('body not provided!');
  }

  return database()
    .child(`players/${playerKey}/${path}`)
    .setWithPriority(body, priority, err => {
      if (err) {
        throw new Error(err);
      }
    });
};
