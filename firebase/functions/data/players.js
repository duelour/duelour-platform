const q = require('q');

const { database } = require('./firebase');

exports.setPlayerWithPriority = (
  playerKey,
  path,
  body,
  priority = 0 - Date.now()
) => {
  const deferred = q.defer();

  if (!playerKey) {
    deferred.reject(new Error('playerKey not provided!'));
    return deferred.promise;
  }
  if (!path) {
    deferred.reject(new Error('path not provided!'));
    return deferred.promise;
  }
  if (!body) {
    deferred.reject(new Error('body not provided!'));
    return deferred.promise;
  }

  database()
    .child(`players/${playerKey}/${path}`)
    .setWithPriority(body, priority, err => {
      if (err) {
        deferred.reject(new Error(err));
      }
    })
    .then(() => deferred.resolve({}))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};
