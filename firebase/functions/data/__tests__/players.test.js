const { setPlayerWithPriority } = require('../players');
const { database } = require('../firebase');

jest.mock('../firebase', () => ({
  database: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnValue({
      setWithPriority: jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve('mockData')))
    })
  })
}));

describe('setPlayerWithPriority', () => {
  it('should throw an error if playerKey not provided', () => {
    setPlayerWithPriority().catch(err => {
      expect(err.message).toBe('playerKey not provided!');
    });
  });

  it('should throw an error if path not provided', () => {
    setPlayerWithPriority('mockPlayerKey').catch(err => {
      expect(err.message).toBe('path not provided!');
    });
  });

  it('should throw an error if body not provided', () => {
    setPlayerWithPriority('mockPlayerKey', 'mockPath').catch(err => {
      expect(err.message).toBe('body not provided!');
    });
  });

  it('should set the player', () => {
    setPlayerWithPriority('mockPlayerKey', 'mockPath', {
      mockKey: 'mockVal'
    }).then(() =>
      expect(database().child().setWithPriority).toBeCalled()
    );
  });
});
