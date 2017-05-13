const { createChallenge } = require('../data/challenges');
const { setPlayerWithPriority } = require('../data/players');

module.exports = ({ req, res }) => {
  const { challengeDisplayName, players, creator } = req.body;
  let challengeKey;

  createChallenge({
    created: new Date().getTime(),
    creator,
    displayName: challengeDisplayName,
    players,
    status: 'pending'
  })
    .then(challenge => {
      challengeKey = challenge.key;
      const requests = players.map(player => {
        const challengeChild = player.key === creator ? 'active' : 'pending';
        return setPlayerWithPriority(
          player.key,
          `challenges/${challengeChild}/${challenge.key}`,
          true
        );
      });
      return Promise.all(requests);
    })
    .then(() => {
      res.send({ key: challengeKey });
    });
};
