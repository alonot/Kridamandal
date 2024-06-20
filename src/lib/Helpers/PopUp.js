class PopUp{
    /**
     * @param {string} title
     * @param {string} message
     * @param {Boolean} isOn
     * @param {Array<string>} inputHints
     */
    constructor(title,message,isOn,inputHints){
        this.title = title
        this.message = message
        this.isOn = isOn
        this.inputHints = inputHints
        this.interval = null;
        this.totalTime = 0
        this.answers =[]
    }
}

export let GAMEMODE = Object.freeze({
    AI:1,
    OFFLINE: 2,
    MULTIPLAYER: 3
})

export default PopUp