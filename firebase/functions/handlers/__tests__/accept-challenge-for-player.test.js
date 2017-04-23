const acceptChallengeForPlayer = require('../accept-challenge-for-player');
const { updateChallenge } = require('../../data/challenges');

jest.mock('../../data/challenges', () => ({
  updateChallenge: jest
    .fn()
    .mockReturnValue(new Promise(resolve => resolve('mockData')))
}));

describe('acceptChallengeForPlayer', () => {
  it('should call updateChallenge', () => {
    const req = {
      body: {
        challengeKey: 'mockChallengeKey',
        playerKey: 'mockPlayerKey'
      }
    };

    acceptChallengeForPlayer({ req });

    expect(updateChallenge).toBeCalledWith('mockChallengeKey', {
      status: 'active'
    });
  });
});
