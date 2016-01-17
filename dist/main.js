'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.INIT_STATE = undefined;
exports.gamesReducer = gamesReducer;

var _lodash = require('lodash');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INIT_STATE = exports.INIT_STATE = {
    games: {}
};
function checkGame(_ref) {
    var id = _ref.id;
    var state = _ref.state;

    if (!state.games[id]) {
        throw new Error('No game id #' + id);
    }
}
function gamesReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? INIT_STATE : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case '//init/state':
            return action.state.board;
        case 'GAME:SET':
            return (0, _lodash.merge)({}, state, {
                games: _defineProperty({}, action.id, action.game)
            });

        case 'GAME:JOIN':
            checkGame({ id: action.id, state: state });
            // should this piece of logic be here?
            if (state.games[action.id].players.length >= 2 || state.games[action.id].players.indexOf(action.playerId) != -1) {
                return state;
            }

            return (0, _lodash.merge)({}, state, { games: _defineProperty({}, action.id, {
                    players: [].concat(_toConsumableArray(state.games[action.id].players), [action.playerId])
                }) });

        case 'GAME:PLAY':
            if (action.gameId) {
                console.warn('[DEPRECATED] GAME:PLAY - please use id instead of gameId');
                action.id = action.gameId;
            }

            checkGame({ id: action.id, state: state });
            return (0, _lodash.merge)({}, state, {
                games: _defineProperty({}, action.id, {
                    matrix: _defineProperty({}, action.row, _defineProperty({}, action.column, state.games[action.id].players.indexOf(action.playerId))),
                    history: [].concat(_toConsumableArray(state.games[action.id].history), [{ player: action.playerId, row: action.row, column: action.column }])
                })
            });

            return state;

        case 'GAME:FINISH':
            if (action.gameId) {
                console.warn('[DEPRECATED] GAME:FINISH - please use id instead of gameId');
                action.id = action.gameId;
            }

            checkGame({ id: action.id, state: state });
            return (0, _lodash.merge)({}, state, {
                games: _defineProperty({}, action.id, {
                    finished: true
                })
            });

        case 'GAME:SET_PLAYER':
            if (action.gameId) {
                console.warn('[DEPRECATED] GAME:SET_PLAYE - please use id instead of gameId');
                action.id = action.gameId;
            }

            checkGame({ id: action.id, state: state });
            if (state.player != action.playerId) {
                return (0, _lodash.merge)({}, state, { games: _defineProperty({}, action.id, { player: action.playerId }) });
            }

            return state;
    }

    return state;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createError = createError;
exports.canPlay = canPlay;
exports.hasWon = hasWon;

var _lodash = require('lodash');

function createError(error) {
    return {
        type: 'GAME:ERROR',
        error: error
    };
}

function canPlay(_ref, game) {
    var row = _ref.row;
    var column = _ref.column;
    var playerId = _ref.playerId;

    if (!playerId) {
        throw new Error('No playerId given');
    }
    if (typeof row == "undefined" || typeof column == "undefined") {
        throw new Error('position missing');
    }
    if (!game) {
        throw new Error('no game given in pos #2');
    }

    console.log(game);

    if (game.players.length < 2) {
        return createError("Not all players have joined");
    }

    if (game.finished) {
        return createError("game's finished");
    }

    if (game.players[game.player] != playerId) {
        return createError("not this player's turn");
    }

    if (game.matrix[row][column] !== null) {
        return createError("This ceil is not available");
    }

    if (row != 0 && game.matrix[row - 1][column] === null) {
        return createError("Gravity fail");
    }

    return true;
}

function hasWon(_ref2, game) {
    var playerPosition = _ref2.playerPosition;
    var row = _ref2.row;
    var column = _ref2.column;

    if (typeof playerPosition == "undefined") {
        throw new Error('No playerPosition given');
    }
    if (typeof row == "undefined" || typeof column == "undefined") {
        throw new Error('position missing');
    }
    if (!game) {
        throw new Error('no game given in pos #2');
    }
    if (game.matrix[row][column] != playerPosition) {
        throw new Error('this ceil is not yours');
    }

    function pathFn(_ref3) {
        var x = _ref3.x;
        var y = _ref3.y;

        var path = [a(x + row, y + column), a(2 * x + row, 2 * y + column), a(3 * x + row, 3 * y + column)];

        return (0, _lodash.every)(path, function (cell) {
            return cell == playerPosition;
        });
    }

    function a(x, y) {
        return (0, _lodash.get)(game.matrix, '[' + x + '][' + y + ']', null);
    }

    var vectors = [{ x: -1, y: +1 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 1, y: +1 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 1 }];

    return (0, _lodash.some)(vectors, pathFn);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createGame = createGame;
exports.setGame = setGame;
exports.joinGame = joinGame;
exports.play = play;
exports.finishGame = finishGame;
function createGame(_ref) {
    var id = _ref.id;

    if (!id) {
        throw new Error('No ID given');
    }

    var game = {
        matrix: { 0: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }, 1: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }, 2: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }, 3: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }, 4: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }, 5: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null } },
        players: [],
        history: [],
        player: 0,
        finished: false,
        id: id
    };
    return setGame({ game: game });
}

function setGame(_ref2) {
    var game = _ref2.game;

    if (!game) {
        throw new Error('No game given');
    }

    return {
        type: 'GAME:SET',
        id: game.id,
        game: game
    };
}

function joinGame(_ref3) {
    var id = _ref3.id;
    var playerId = _ref3.playerId;

    if (!id) {
        throw new Error('No ID given');
    }
    if (!playerId) {
        throw new Error('No playerId given');
    }

    return {
        type: 'GAME:JOIN',
        id: id,
        playerId: playerId
    };
}

function play(_ref4) {
    var id = _ref4.id;
    var row = _ref4.row;
    var column = _ref4.column;
    var playerId = _ref4.playerId;

    if (!id) {
        throw new Error('No ID given');
    }
    if (!playerId) {
        throw new Error('No playerId given');
    }
    if (typeof row == "undefined" || typeof column == "undefined") {
        throw new Error('position missing');
    }

    return {
        type: 'GAME:PLAY',
        id: id,
        row: row,
        column: column,
        playerId: playerId
    };
}

function finishGame(_ref5) {
    var id = _ref5.id;

    if (!id) {
        throw new Error('No ID given');
    }

    return {
        type: 'GAME:FINISH',
        id: id
    };
}
