import {every, some, get} from 'lodash'

export function createError(error) {
    return {
        type: 'GAME:ERROR',
        error
    }
}

export function canPlay({row, column, playerId}, game) {
    if(!playerId) {
        throw new Error('No playerId given')
    }
    if(typeof row == "undefined" || typeof column == "undefined") {
        throw new Error('position missing')
    }
    if(!game) {
        throw new Error('no game given in pos #2')
    }


    if(game.players.length < 2) {
        return createError("Not all players have joined")
    }

    if(game.finished) {
        return createError("game's finished")
    }

    if(game.players[game.player] != playerId) {
        return createError("not this player's turn")
    }

    if(game.matrix[row][column] !== null) {
        return createError("This ceil is not available")
    }

    if(row != 0 && game.matrix[row - 1][column] === null) {
        return createError("Gravity fail")
    }

    return true
}


export function hasWon({playerPosition, row, column},game) {
    if(typeof playerPosition == "undefined") {
        throw new Error('No playerPosition given')
    }
    if(typeof row == "undefined" || typeof column == "undefined") {
        throw new Error('position missing')
    }
    if(!game) {
        throw new Error('no game given in pos #2')
    }
    if(game.matrix[row][column] != playerPosition) {
        throw new Error('this ceil is not yours')
    }

    function pathFn({x,y}) {
        var path = [a(x+row,y+column),a(2*x+row,2*y+column),a(3*x+row,3*y+column)]

        return every(path, cell => cell == playerPosition)
    }

    function a(x,y) {
       return get(game.matrix, `[${x}][${y}]`, null)
    }

    var vectors = [{x:-1,y:+1},{x:-1,y:0},{x:-1,y:-1},{x:1,y:+1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:0,y:1}]

    return some(vectors, pathFn)
}
