export class MinMax{
    checkWinnerFunc: Function;
    scoreFunc:Function;
    getActions:Function;
    updateBoard:Function;
    maxdepth: number;
    aiPlayer:number;

    constructor(checkWinnerFunc:Function,scoreFunc:Function,getActions:Function, updateBoard:Function,maxdepth: number,ai:number){
        this.checkWinnerFunc = checkWinnerFunc;
        this.scoreFunc = scoreFunc;
        this.getActions = getActions;
        this.updateBoard = updateBoard;
        this.maxdepth = maxdepth;
        this.aiPlayer =ai;
    }

    public maxVal(board:Array<any>, depth: number,alpha:number,beta:number){
        if (this.checkWinnerFunc(board,1)){ // check if human won or not
            return [-999 + depth,-1];
        }
        if (depth == this.maxdepth){
            return [this.scoreFunc(board),-1];
        }
        
        let actions :Array<any> = this.getActions(board)
        let max_result = [-99999,-1];
        for(let i =0 ; i< actions.length; i++){
            let action = actions[i];
            let val = this.minVal(this.updateBoard(board,action,"2"),depth + 1,alpha, beta);
            if (max_result[0]<=val[0]){
                max_result = [val[0],action];
            }
            if (max_result[0] > beta){
                return max_result;    
            }
            alpha = Math.max(max_result[0],alpha)
        }
        if (max_result[0] == -99999){
            max_result = [0,-1];
        }
        return max_result;
    
    }
    
    
    public minVal(board:Array<any>, depth: number,alpha:number,beta:number){
        if (this.checkWinnerFunc(board,1)){ // check if ai won or not
            return [999 + depth,-1];
        }
        if (depth == this.maxdepth){
            return this.scoreFunc(board);
        }
        
        let actions = this.getActions(board)
        let min_result = [99999,-1];
        for(let i =0 ; i< actions.length; i++){
            let action = actions[i];
            let val = this.maxVal(this.updateBoard(board,action,"1"),depth + 1,alpha, beta);
            
            if (min_result[0] >= val [0]){
                min_result = [val[0],action];
            }
            if (min_result[0] < alpha){
                return min_result;    
            }
            beta = Math.min(min_result[0],beta);
        }
        return min_result;
       
    
    }
}