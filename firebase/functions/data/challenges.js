const q = require('q');
const { database } = require('./firebase');

exports.createChallenge = body => {
  const deferred = q.defer();
  const { creator, players } = body;

  if (!players || players.length === 0) {
    throw new Error('Must have at least one player to create a challenge!');
  }

  const newChallengeRef = database().child('challenges').push();
  const challengePlayers = players.reduce((res, player) => {
    const hasPlayerAccepted = player.key === creator;
    res[player.key] = Object.assign({}, player, { hasPlayerAccepted });
    return res;
  }, {});
  const challengeBody = Object.assign({}, body, {
    players: challengePlayers
  });

  newChallengeRef
    .set(challengeBody, err => {
      if (err) {
        deferred.reject(new Error(err));
      }
    })
    .then(() => deferred.resolve(newChallengeRef));
  return deferred.promise;
};
