
export let GAMEMODE = Object.freeze({
    AI:1,
    OFFLINE: 2,
    MULTIPLAYER: 3
})


export let COLORS = [
    "#B91C1C","#1D4ED8","#15803D","#B45309","#A21CAF","#BE185D"
]

export const DIALOG = 'dialog'
export const ASK = 'ask'
export const LOADING = 'loading'


/**
 * @param {any} array
 */
export function shuffle(array){ // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentInd = array.length

    while( currentInd != 0){

        let randInd = Math.floor(Math.random() * currentInd)
        currentInd --;

        [array[currentInd], array[randInd]] = [array[randInd] , array[currentInd]]
    }
}