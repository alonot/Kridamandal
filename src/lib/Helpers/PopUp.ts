export class PopUp{
    title:string;
    message:string;
    isOn:boolean;
    inputHints:Array<string>
    interval:number
    totalTime:number
    afterMessage:Function | null  /// first if this is given 
    // then first asnwer is always true/false, based on whether 'OK' was pressed or 'cancel'
    // please do not expect answer to the inputs if this first argument is false
    cancelOn:boolean
    /**
     * @param {string} title
     * @param {string} message
     * @param {Boolean} isOn
     * @param {Array<string>} inputHints
     */
    constructor(title:string,message:string,isOn:boolean,inputHints:Array<string>){
        this.title = title
        this.message = message
        this.isOn = isOn
        this.inputHints = inputHints
        this.interval = 0;
        this.totalTime = 0
        this.afterMessage = null
        this.cancelOn = false
    }


    public clear(){
        this.interval = 0;
        this.totalTime = 0
        this.afterMessage = null
        this.cancelOn = false
        this.title = ""
        this.message = ""
        this.isOn = false
        this.inputHints = []
    }
}

