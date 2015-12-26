export function createGame({id}) {
    if(!id) {
        throw new Error('No ID given')
    }

    const game = {
        matrix: {0:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},1:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},2:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},3:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},4:{0:null,1:null,2:null,3:null,4:null,5:null,6:null},5:{0:null,1:null,2:null,3:null,4:null,5:null,6:null}},
        players: [],
        history: [],
        player: 0,
        finished: false,
        id
    }
    return setGame({game})
}


export function setGame({game}) {
    if(!game) {
        throw new Error('No game given')
    }

    return {
        type: 'GAME:SET',
        id: game.id,
        game
    }
}

export function joinGame({id, playerId}) {
    if(!id){
        throw new Error('No ID given')
    }
    if(!playerId) {
        throw new Error('No playerId given')
    }

    return {
        type: 'GAME:JOIN',
        id,
        playerId
    }
}

export function play({id, row, column, playerId}) {
    if(!id){
        throw new Error('No ID given')
    }
    if(!playerId) {
        throw new Error('No playerId given')
    }
    if(typeof row == "undefined" || typeof column == "undefined") {
        throw new Error('position missing')
    }

    return {
        type: 'GAME:PLAY',
        id,
        gameId: id, // backward
        row,
        column,
        playerId
    }
}

export function finishGame({id}) {
    if(!id){
        throw new Error('No ID given')
    }

    return {
        type: 'GAME:FINISH',
        id,
        gameId: id // backward
    }
}
