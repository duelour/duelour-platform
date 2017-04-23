const createChallengeForPlayer = require('../create-challenge-for-player');
const { createChallenge } = require('../../data/challenges');

jest.mock('../../data/challenges', () => ({
  createChallenge: jest
    .fn()
    .mockReturnValue(new Promise(resolve => resolve('mockData')))
}));

describe('createChallengeForPlayer', () => {
  it('should call createChallenge', () => {
    const req = {
      body: {
        challengeDisplayName: 'mockDisplayName',
        creator: 'mockPlayerKey1',
        players: [
          {
            key: 'mockPlayerKey1',
            displayName: 'mockPlayerDisplayName1'
          },
          {
            key: 'mockPlayerKey2',
            displayName: 'mockPlayerDisplayName2'
          }
        ]
      }
    };

    createChallengeForPlayer({ req });

    expect(createChallenge).toBeCalledWith({
      created: jasmine.any(Number),
      creator: 'mockPlayerKey1',
      players: [
        {
          key: 'mockPlayerKey1',
          displayName: 'mockPlayerDisplayName1'
        },
        {
          key: 'mockPlayerKey2',
          displayName: 'mockPlayerDisplayName2'
        }
      ],
      displayName: 'mockDisplayName',
      status: 'pending'
    });
  });
});
