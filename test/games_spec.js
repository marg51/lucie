import {expect} from 'chai';
import {reducer} from '../reducers/games'
import * as actions from '../actions/games'
import * as _ from 'lodash'

describe('Games', () => {

  describe('set game (GAME:SET)', () => {

    describe('Actions', () => {
      it('should have createGame', () => {
        expect(actions.createGame).to.be.an('function')
      })
      it('should create a new game', () => {
        expect(actions.createGame({id:1})).to.deep.equal({
          type: 'GAME:SET',
          id:1,
          game: {
            id: 1,
            matrix: {0:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},1:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},2:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},3:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},4:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},5:{0:null,1:null,2:null,3:null,4:null,5:null,6:null}},
            players: [],
            history: [],
            player: 0,
            finished: false
          }
        })
      })

      it('should have setGame', () => {
        expect(actions.setGame).to.be.an('function')
      })

      it('should load a new game', () => {
        expect(actions.setGame({game:{id:1}})).to.deep.equal({
          type: 'GAME:SET',
          id:1,
          game: {
            id: 1
          }
        })
      })
    })

    describe('Reducers', () => {
      it('should add a new game with correct id', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        expect(state.games[1]).to.exist
      });

      it('should add a new game with correct values', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        expect(state.games[1].id).to.equal(1)
        expect(state.games[1].matrix).to.exist
      });

      it('should update a game', () => {
        var game = actions.createGame({id: 1})

        var state = reducer(undefined, actions.setGame({game}))

        var game2 = {id: 1, newfield: true}

        state = reducer(state, actions.setGame({game: game2}))
        expect(state.games[1].newfield).to.equal(true)
        expect(state.games[1].matrix).to.exists
      });

      it('should create a new .games object', () => {
        const empty_state = reducer(undefined, {type: 'unknown'})

        const new_state = reducer(empty_state, actions.createGame({id: 1}))

        expect(empty_state.games).to.not.equal(new_state.games)
      })
    })
  });

  describe('add player (GAME:JOIN)', () => {

    describe('Actions', () => {
      it('should have joinGame', () => {
        expect(actions.joinGame).to.be.a('function')
      })
    })

    describe('Reducers', () => {
      it('should add a player', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent'}))

        expect(state.games[1].players.length).to.equal(1)
        expect(state.games[1].players[0]).to.equal('laurent')
      })

      it('should add two players', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent'}))
        state = reducer(state, actions.joinGame({id: 1, playerId: 'moi'}))

        expect(state.games[1].players.length).to.equal(2)
        expect(state.games[1].players[0]).to.equal('laurent')
        expect(state.games[1].players[1]).to.equal('moi')
      })

      it('shouldnt add duplicate players', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent'}))
        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent'}))

        expect(state.games[1].players.length).to.equal(1)
        expect(state.games[1].players[0]).to.equal('laurent')
      })

      it('shouldnt add more than 2 players', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent'}))
        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent2'}))
        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent3'}))

        expect(state.games[1].players.length).to.equal(2)
        expect(state.games[1].players[0]).to.equal('laurent')
        expect(state.games[1].players[1]).to.equal('laurent2')
      })

      it('should create a new object', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))
        var players = state.games[1].players

        state = reducer(state, actions.joinGame({id: 1, playerId: 'laurent'}))

        expect(players.length).to.equal(0)
        expect(state.games[1].players.length).to.equal(1)
      })
    })
  })

  describe('play (GAME:PLAY)', () => {
    describe('Actions', () => {
      it('should have play()', () => {
        expect(actions.play).to.be.a('function')
      })

      it('should return correct object',()=>{
        expect(actions.play({id: 1, row:0, column: 1, playerId: "laurent"})).to.deep.equal({
          type: 'GAME:PLAY',
          row: 0,
          gameId: 1,
          column: 1,
          id: 1,
          playerId: "laurent"
        })
      })
    })

    describe('Reducers', () => {
      function setUpGame() {
        var state = reducer(undefined, actions.createGame({id: 1}))

        state = reducer(state, actions.joinGame({id: 1, playerId: 'Laurent'}))
        state = reducer(state, actions.joinGame({id: 1, playerId: 'Laurent2'}))

        return state;
      }
      it('should update ceils', () => {
        var state = setUpGame()

        state = reducer(state, actions.play({id: 1, playerId: 'Laurent', row: 0, column: 1}))

        expect(state.games[1].matrix[0][1]).to.equal(0)

        state = reducer(state, actions.play({id: 1, playerId: 'Laurent2', row: 1, column: 1}))

        expect(state.games[1].matrix[1][1]).to.equal(1)
      })

      it('should add history', () => {
        var state = setUpGame()

        state = reducer(state, actions.play({id: 1, playerId: 'Laurent', row: 0, column: 1}))

        expect(state.games[1].history.length).to.equal(1)
        expect(state.games[1].history[0]).to.deep.equal({
          player: 'Laurent',
          row: 0,
          column: 1
        })
      })

      it('should not mutate matrix', () => {
        var state = setUpGame()
        var matrix = state.games[1].matrix

        state = reducer(state, actions.play({id: 1, playerId: 'Laurent', row: 0, column: 1}))

        // old matrix is not updated
        expect(matrix[0][1]).to.equal(null)
      })

      it('should not mutate history', () => {
        var state = setUpGame()
        var history = state.games[1].history

        state = reducer(state, actions.play({id: 1, playerId: 'Laurent', row: 0, column: 1}))

        // old matrix is not updated
        expect(history.length).to.equal(0)
      })
    })
  })

  describe('finish a game (GAME:FINISH)', () => {
    describe('Actions', () => {
      it('should have finishGame()', () => {
        expect(actions.finishGame).to.be.a('function')
      })
    })

    describe('Reducers', () => {
      it('should finish a game', () => {
        var state = reducer(undefined, actions.createGame({id: 1}))

        state = reducer(state, actions.finishGame({id: 1}))

        expect(state.games[1].finished).to.equal(true)
      })
    })
  })

});
