const q = require('q');
const { database } = require('./firebase');

exports.createChallenge = body => {
  const deferred = q.defer();
  const { creator, players } = body;

  if (!players || players.length === 0) {
    deferred.reject(
      new Error('Must have at least one player to create a challenge!')
    );
    return deferred.promise;
  }

  const newChallengeRef = database().child('challenges').push();
  const challengePlayers = players.reduce((res, player) => {
    const hasPlayerAccepted = player.key === creator;
    res[player.key] = Object.assign({}, player, { 
      hasPlayerAccepted,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      totalScore: 0
    });
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
    .then(() => deferred.resolve(newChallengeRef))
    .catch(err => deferred.reject(new Error(err)));

  return deferred.promise;
};

exports.updateChallenge = (challengeKey, body) => {
  const deferred = q.defer();
  const challengeRef = database().child(`challenges/${challengeKey}`);

  challengeRef
    .update(body, err => {
      if (err) {
        deferred.reject(new Error(err));
      }
    })
    .then(() => deferred.resolve(challengeRef))
    .catch(err => deferred.reject(new Error(err)));

  return deferred.promise;
};
