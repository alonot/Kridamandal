export class PopUp{
    title:string;
    message:string;
    isOn:boolean;
    inputHints:Array<string>
    interval:number
    totalTime:number
    answers:Array<any>
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
        this.answers =[]
    }
}

