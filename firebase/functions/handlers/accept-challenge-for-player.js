const { database } = require('../data/firebase');
const { updateChallenge } = require('../data/challenges');
const { setPlayerWithPriority } = require('../data/players');

module.exports = ({ req, res }) => {
  const { playerKey, challengeKey } = req.body;

  // Update challenge
  updateChallenge(challengeKey, {
    status: 'active'
  })
    .then(challengeRef => {
      const playerAcceptedRef = challengeRef.child(
        `players/${playerKey}/hasPlayerAccepted`
      );
      return playerAcceptedRef.set(true, err => {
        if (err) {
          throw new Error(err);
        }
      });
    })
    .then(() => {
      // Update player (remove pending challenge, append active challenge)
      database()
        .child(`players/${playerKey}/challenges/pending/${challengeKey}`)
        .remove();
      return setPlayerWithPriority(
        playerKey,
        `challenges/active/${challengeKey}`,
        true
      );
    })
    .then(() => res.send({}));
};
