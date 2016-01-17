import {merge} from 'lodash'

export const INIT_STATE = {
    games: {}
}
function checkGame({id, state}) {
    if(!state.games[id]) {
        throw new Error('No game id #'+id)
    }
}
export function gamesReducer(state = INIT_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.board
        case 'GAME:SET':
            return merge({}, state, {
                games: {
                    [action.id]: action.game
                }
            })

        case 'GAME:JOIN':
            checkGame({id: action.id, state})
            // should this piece of logic be here?
            if(state.games[action.id].players.length>=2 || state.games[action.id].players.indexOf(action.playerId) != -1) {
                return state
            }

            return merge({}, state, {games: {[action.id]: {
                players: [...state.games[action.id].players, action.playerId],
            }}})

        case 'GAME:PLAY':
            if(action.gameId) {
                console.warn('[DEPRECATED] GAME:PLAY - please use id instead of gameId')
                action.id = action.gameId
            }

            checkGame({id: action.id, state})
            return merge({}, state, {
                games: {
                    [action.id]: {
                        matrix: {
                            [action.row]: {[action.column]: state.games[action.id].players.indexOf(action.playerId)}
                        },
                        history: [...state.games[action.id].history, {player: action.playerId, row: action.row, column: action.column}]
                    }
                }
            })

         return state

        case 'GAME:FINISH':
            if(action.gameId) {
                console.warn('[DEPRECATED] GAME:FINISH - please use id instead of gameId')
                action.id = action.gameId
            }

            checkGame({id: action.id, state})
            return merge({}, state, {
                games: {
                    [action.id]: {
                        finished: true
                    }
                }
            })

        case 'GAME:SET_PLAYER':
            if(action.gameId) {
                console.warn('[DEPRECATED] GAME:SET_PLAYE - please use id instead of gameId')
                action.id = action.gameId
            }

            checkGame({id: action.id, state})
            if(state.player != action.playerId) {
                return merge({}, state, {games: {[action.id]: {player: action.playerId}}})
            }

            return state
    }

    return state;
}
