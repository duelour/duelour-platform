const { database } = require('./firebase');

exports.createChallenge = body => {
  return new Promise((resolve, reject) => {
    const { creator, players } = body;

    if (!players || players.length === 0) {
      reject(new Error('Must have at least one player to create a challenge!'));
      return null;
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
      .set(challengeBody, (err) => {
        if (err) {
          reject(new Error(err));
        }
      })
      .then(() => resolve(newChallengeRef))
      .catch(err => reject(new Error(err)));
  });
};

exports.updateChallenge = (challengeKey, body) => {
  return new Promise((resolve, reject) => {
    const challengeRef = database().child(`challenges/${challengeKey}`);

    challengeRef
      .update(body, err => {
        if (err) {
          reject(new Error(err));
        }
      })
      .then(() => resolve(challengeRef))
      .catch(err => reject(new Error(err)));
  });
};
