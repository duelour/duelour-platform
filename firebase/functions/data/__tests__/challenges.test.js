const { createChallenge, updateChallenge } = require('../challenges');
const { database } = require('../firebase');

jest.mock('../firebase', () => ({
  database: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnValue({
      push: jest.fn().mockReturnValue({
        set: jest
          .fn()
          .mockReturnValueOnce(
            new Promise((resolve) => resolve('mockData'))
          )
          .mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error('mockError')))
          )
      }),
      update: jest.fn()
        .mockReturnValueOnce(
          new Promise((resolve) => resolve('mockData'))
        )
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error('mockError')))
        )
    }),
  })
}));

describe('createChallenge', () => {
  it('should throw an error if no players', () => {
    const body = {};

    createChallenge(body).catch(err => {
      expect(err).toBe('Must have at least one player to create a challenge!');
    });
  });

  it('should create a new challenge', () => {
    const body = {
      creator: 'mockPlayerKey2',
      players: [
        {
          key: 'mockPlayerKey1',
          displayName: 'mockDisplayName1'
        },
        {
          key: 'mockPlayerKey2',
          displayName: 'mockDisplayName2'
        }
      ]
    };

    createChallenge(body)
      .then(() => {
        expect(database().child().push().set).toBeCalledWith({
          creator: 'mockPlayerKey2',
          players: {
            mockPlayerKey1: {
              displayName: 'mockDisplayName1',
              hasPlayerAccepted: false,
              key: 'mockPlayerKey1'
            },
            mockPlayerKey2: {
              displayName: 'mockDisplayName2',
              hasPlayerAccepted: true,
              key: 'mockPlayerKey2'
            }
          }
        }, jasmine.any(Function));
      })
      .catch((err) => console.log(err));
  });

  it('should throw an error if there is an error', () => {
    const body = {
      creator: 'mockPlayerKey2',
      players: [
        {
          key: 'mockPlayerKey1',
          displayName: 'mockDisplayName1'
        },
        {
          key: 'mockPlayerKey2',
          displayName: 'mockDisplayName2'
        }
      ]
    };

    createChallenge(body)
      .catch((err) => expect(err).toBeTruthy());
  });
});

describe('updateChallenge', () => {
  it('should update a challenge', () => {
    const challengeKey = 'mockChallengeKey';
    const body = { mockKey: 'mockVal' };

    updateChallenge(challengeKey, body)
      .then(() => 
        expect(database().child().update).toBeCalled()
      );
  });
});
