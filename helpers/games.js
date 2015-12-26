export function createError(error) {
    return {
        type: 'GAME:ERROR',
        error
    }
}

export function canPlay({id, row, column, playerId}, game) {
    if(!id){
        throw new Error('No ID given')
    }
    if(!playerId) {
        throw new Error('No playerId given')
    }
    if(!row || !column) {
        throw new Error('position missing')
    }
    if(!game) {
        throw new Error('no game given in pos #2')
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
}
