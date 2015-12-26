import * as _ from 'lodash'

export const INIT_STATE = {
    games: {}
}

export function reducer(state = INIT_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.board
        case 'GAME:SET':
            return _.merge({}, state, {
                games: {
                    [action.id]: action.game
                }
            })

        case 'GAME:JOIN':
            if(state.games[action.id].players.length>=2 || state.games[action.id].players.indexOf(action.playerId) != -1) {
                return state
            }

            return _.merge({}, state, {games: {[action.id]: {
                players: [...state.games[action.id].players, action.playerId],
            }}})

        case 'GAME:PLAY':
            // if(action.playerId == state.games[action.gameId].players[state.games[action.gameId].player]) {
            //     if(state.games[action.gameId].matrix[action.row][action.column] === null) {
            //         if(action.row == 0 || state.games[action.gameId].matrix[action.row - 1][action.column] !== null) {
                        return _.merge({}, state, {
                            games: {
                                [action.gameId]: {
                                    matrix: {
                                        [action.row]: {[action.column]: state.games[action.gameId].players.indexOf(action.playerId)}
                                    },
                                    history: [...state.games[action.gameId].history, {player: action.playerId, row: action.row, column: action.column}]
                                }
                            }
                        })
            //         }
            //     }
            // }
         return state

        case 'GAME:FINISH':
            return _.merge({}, state, {
                games: {
                    [action.gameId]: {
                        finished: true
                    }
                }
            })

        // @DEPRECATED
        case 'GAME:SET_PLAYER':
            if(state.player != action.playerId) {
                return _.merge({}, state, {games: {[action.gameId]: {player: action.playerId}}})
            }

            return state
    }

    return state;
}
