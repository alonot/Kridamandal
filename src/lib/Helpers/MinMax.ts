export class MinMax{
    checkWinnerFunc: Function;
    scoreFunc:Function;
    getActions:Function;
    updateBoard:Function;
    maxdepth: number;
    aiPlayer:number;
    rand : number;

    constructor(checkWinnerFunc:Function,scoreFunc:Function,getActions:Function, updateBoard:Function,maxdepth: number,ai:number,randomness:number){
        this.checkWinnerFunc = checkWinnerFunc;
        this.scoreFunc = scoreFunc;
        this.getActions = getActions;
        this.updateBoard = updateBoard;
        this.maxdepth = maxdepth;
        this.aiPlayer =ai;
        this.rand = randomness
    }

    public maxVal(board:Array<any>, depth: number,alpha:number,beta:number){
        if (this.checkWinnerFunc(board,1)){ // check if human won or not
            return [-999 + depth,-1];
        }
        if (depth == this.maxdepth){
            return [this.scoreFunc(board,"2"),-1];
        }
        
        let actions :Array<any> = this.getActions(board)
        let max_result = [-99999,-1];
        let equalResults = []
        // let all = []
        for(let i =0 ; i< actions.length; i++){
            let action = actions[i];
            let val = this.minVal(this.updateBoard(board,action,"2",true),depth + 1,alpha, beta);
            // console.log("Max:" + val + ", " + action)
            // all.push([val[0],action])
            if (max_result[0]<val[0]){
                max_result = [val[0],action];
                equalResults = [action];
            }else if (max_result[0] == val[0]){
                equalResults.push(action)
            }
            if (max_result[0] > beta){
                return [max_result[0],this.getRandomAction(equalResults)];    
            }
            alpha = Math.max(max_result[0],alpha)
        }
        // console.log(all)
        // console.log(board)
        if (max_result[0] == -99999){
            max_result = [0,-1];
        }
        return [max_result[0],this.getRandomAction(equalResults)];
    
    }
    
    
    public minVal(board:Array<any>, depth: number,alpha:number,beta:number){
        if (this.checkWinnerFunc(board,2)){ // check if ai won or not
            return [999 - depth,-1];
        }
        if (depth == this.maxdepth){
            return [this.scoreFunc(board,"2"),-1];
        }
        
        let actions = this.getActions(board)
        let min_result = [99999,-1];
        let equalResults = []
        for(let i =0 ; i< actions.length; i++){
            let action = actions[i];
            let val = this.maxVal(this.updateBoard(board,action,"1",true),depth + 1,alpha, beta);
            if (min_result[0] > val [0]){
                min_result = [val[0],action];
                equalResults = [action]
            }else if (min_result[0] == val[0]){
                equalResults.push(action)
            }
            if (min_result[0] < alpha){
                return [min_result[0],this.getRandomAction(equalResults)];    
            }
            beta = Math.min(min_result[0],beta);
        }
        if (min_result[0] == 99999){
            min_result = [0,-1];
        }
        return [min_result[0],this.getRandomAction(equalResults)];
    }

    private getRandomAction(equalResults:Array<number>){
        if (equalResults.length == 0){
            return - 1;
        }
        if (equalResults.length == 1){
            return equalResults[0];
        }else{
            if (Math.random() + this.rand > 1){
                let pos = ((Math.random() * 1000) | 0) % equalResults.length;
                // console.log("Sending random : " + pos + "from list : " + equalResults);
                return equalResults[pos]

            }
            return equalResults[0];
        }
    }

}