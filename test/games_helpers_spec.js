import {expect} from 'chai';
import {gamesReducer as reducer} from '../reducers/games'
import {hasWon, canPlay} from '../helpers/games'
import * as actions from '../actions/games'

describe('GamesHelper', () => {

  describe('CanPlay', () => {
    function createGame() {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent2'}))

      state = reducer(state, actions.play({id:1, playerId: 'laurent1', row: 0, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent2', row: 1, column: 1}))

      return state
    }

    it('should allow me to play if everything is fine', () => {
      var state = createGame()

      expect(canPlay({playerId: 'laurent', row: 0, column: 3}, state.games[1])).to.equal(true)
    })

    it('should not allow me to play if ceil is taken', () => {
      var state = createGame()

      expect(canPlay({playerId: 'laurent', row: 0, column: 1}, state.games[1]).error).to.contain("available")
    })
    it('should not allow me to play if ceil is out of gravity', () => {
      var state = createGame()

      expect(canPlay({playerId: 'laurent', row: 3, column: 1}, state.games[1]).error).to.contain("Gravity")
    })
    it('should not allow me to play if not my turn', () => {
      var state = createGame()

      expect(canPlay({playerId: 'laurent2', row: 0, column: 3}, state.games[1]).error).to.contain("turn")
    })
    it('should not allow me to play if game is finished', () => {
      var state = createGame()
      state = reducer(state, actions.finishGame({id: 1}))

      expect(canPlay({playerId: 'laurent', row: 0, column: 3}, state.games[1]).error).to.contain('finished')
    })

    it('should not allow me to play if not all players are there', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      expect(canPlay({playerId: 'laurent', row: 0, column: 3}, state.games[1]).error).to.contain('players')
    })

    it('should throw an error if missing game', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      var fn = function() {
        return canPlay({playerId: 'laurent', row: 0, column: 3})
      }

      expect(fn).to.throw('game')
    })

    it('should throw an error if position missing', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      var fn = function() {
        return canPlay({playerId: 'laurent', row: 0}, state.games[1])
      }

      var fn2 = function() {
        return canPlay({playerId: 'laurent', column: 0}, state.games[1])
      }

      expect(fn).to.throw('position')
      expect(fn2).to.throw('position')
    })

    it('should throw an error if missing playerId', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      var fn = function() {
        return canPlay({row: 0, column: 3}, state.games[1])
      }

      expect(fn).to.throw('playerId')
    })
  })


  describe('hasWon', () => {
    function createGame() {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent2'}))

      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 0, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 0, column: 2}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 0, column: 3}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent2', row: 1, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent2', row: 1, column: 2}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent2', row: 1, column: 3}))

      return state
    }

    it('shouldnt find wrong matches', () => {
      var state = createGame()
      expect(hasWon({playerPosition: 0, row: 0, column: 3}, state.games[1])).to.equal(false)
      expect(hasWon({playerPosition: 0, row: 0, column: 2}, state.games[1])).to.equal(false)
      expect(hasWon({playerPosition: 0, row: 0, column: 1}, state.games[1])).to.equal(false)

      state = reducer(state, actions.play({id:1, playerId: 'laurent2', row: 0, column: 4}))

      expect(hasWon({playerPosition: 1, row: 0, column: 4}, state.games[1])).to.equal(false)
    })

    it('should find matches', () => {
      var state = createGame()
      state = reducer(state, actions.play({id: 1, playerId:'laurent', row: 0,column: 4}))
      expect(hasWon({playerPosition: 0, row: 0, column: 4}, state.games[1])).to.equal(true)
      expect(hasWon({playerPosition: 0, row: 0, column: 1}, state.games[1])).to.equal(true)
    })

    it('should find all matches #1', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent2'}))

      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 0, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 1, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 2, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 3, column: 1}))

      expect(hasWon({playerPosition: 0, row: 3, column: 1}, state.games[1])).to.equal(true)
    })

    it('should find all matches #2', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent2'}))

      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 0, column: 1}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 1, column: 2}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 2, column: 3}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 3, column: 4}))

      expect(hasWon({playerPosition: 0, row: 3, column: 4}, state.games[1])).to.equal(true)
      expect(hasWon({playerPosition: 0, row: 0, column: 1}, state.games[1])).to.equal(true)
    })

    it('should find all matches #2', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent2'}))

      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 0, column: 4}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 1, column: 3}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 2, column: 2}))
      state = reducer(state, actions.play({id:1, playerId: 'laurent', row: 3, column: 1}))

      expect(hasWon({playerPosition: 0, row: 0, column: 4}, state.games[1])).to.equal(true)
      expect(hasWon({playerPosition: 0, row: 3, column: 1}, state.games[1])).to.equal(true)
    })

    it('should throw if not his ceil', () => {
      var state = createGame()
      var fn = function() {
        hasWon({playerPosition: 1, row: 0, column: 3}, state.games[1])
      }

      expect(fn).to.throw("ceil")
    })

    it('should throw an error if missing game', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      var fn = function() {
        return hasWon({playerPosition: 'laurent', row: 0, column: 3})
      }

      expect(fn).to.throw('game')
    })

    it('should throw an error if position missing', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      var fn = function() {
        return hasWon({playerPosition: 'laurent', row: 0}, state.games[1])
      }

      var fn2 = function() {
        return hasWon({playerPosition: 'laurent', column: 0}, state.games[1])
      }

      expect(fn).to.throw('position')
      expect(fn2).to.throw('position')
    })

    it('should throw an error if missing playerPosition', () => {
      var state = reducer(undefined, actions.createGame({id:1}))
      state = reducer(state, actions.joinGame({id:1, playerId: 'laurent'}))
      state = reducer(state, actions.finishGame({id: 1}))

      var fn = function() {
        return hasWon({row: 0, column: 3}, state.games[1])
      }

      expect(fn).to.throw('playerPosition')
    })
  })

});
