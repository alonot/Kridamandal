import { MinMax } from "./MinMax";

/**
* Returns the transpose of given array of string treating each character of string as single 
* cell of a 2d matrix. Assumes that all string are of same length
* @param matrix
*/
function transposeStringMatrix(matrix:Array<string>){
   let new_matrix: string[] = [];
   matrix.forEach((row,ind) => {
       if (ind == 0){
           for (let i=0;i<row.length;i++){
               new_matrix.push("")
           }
       }
       for (let i=0;i<row.length;i++){
           new_matrix[i]+=(row[i])
       }
   });

   return new_matrix
}


/**
* new function for checking winner 
* this calls checker() on the board and its transpose to get the full scan
*/
export function checkWinner(board:Array<string>, currentplayer_no: number){
   var toCheck = ""
   let diagonal = "";
   let oppositeDiagonal = "";
   // creating the string to be checked
   for (let i =0;i<3;i++){
       toCheck += (currentplayer_no).toString()
       diagonal += (board[i].at(i))
       oppositeDiagonal += board[i].at(2 - i);
   }
   
   // helper function that check for winner in each ROW
   function checker(board:Array<string>){
       for (let i =0; i< board.length;i++){
           if (toCheck === board[i]){
               return true
           }
       }
   }
   if (toCheck === diagonal || oppositeDiagonal == toCheck){
       return true
   }
   return checker(board) || checker(transposeStringMatrix(board))
}

function getActions(board:Array<string>){
    let actions:Array<number> = []
    let ind = 0;
    board.forEach(row => {
        for (let i=0; i< row.length; i++){
            if (row.at(i) == '0'){
                actions.push(ind);
            }
            ind++;
        }
    });
    return actions;
}

function updateBoard(board:Array<string>, action:number,player:string){
    let new_board = structuredClone(board);
    let currentpos=[(action/3) | 0,action%3]    
    new_board[currentpos[0]] = new_board[currentpos[0]].substring(0,currentpos[1]) +  
            player + new_board[currentpos[0]].substring(currentpos[1]+1)
    return new_board;
}

function scoreFunc(board:Array<string>):number{
    let diagonal = "";
    let oppositeDiagonal = "";
    // creating the string to be checked
    for (let i =0;i<3;i++){
        diagonal += (board[i].at(i))
        oppositeDiagonal += board[i].at(2 - i);
    }
    
    // helper function that check for winner in each ROW
    function checker(board:Array<string>):number{
        let count:number = 0;
        for (let i =0; i< board.length;i++){
            count += board[i].split("2").length - 1;
        }
        return count;
    }

    return checker(board) + checker(transposeStringMatrix(board))
    + diagonal.split("2").length + oppositeDiagonal.split("2").length - 2;
}


export function getAIMove(board: Array<string>,aiplayer:number,filledBlocks:number){

    const solver = new MinMax(checkWinner,scoreFunc,getActions,updateBoard,5,aiplayer,1);

    if (filledBlocks <= 2){
        let equalActions = getActions(board)
        return equalActions[((Math.random() * 100) | 0) % equalActions.length]
    }

    let max_val  = solver.maxVal(board,1,-999999,99999);

    return max_val[1];

}