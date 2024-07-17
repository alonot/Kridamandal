import { MinMax } from "./MinMax";
import { transposeStringMatrix } from "./TicTacToeHelpers";


/**
* new function for checking winner 
* this calls checker() on the board and its transpose to get the full scan
*/
export function checkWinner(board_comb:Array<any[]>, currentplayer_no: number){
   var toCheck = ""
   let diagonal = "";
   let oppositeDiagonal = "";
   const board = board_comb[2]
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

function getActions(board:Array<any[]>){
    let actions:Array<number> = []
    let ind = 0;
    board[2].forEach(row => {
        for (let i=0; i< row.length; i++){
            if (row.at(i) == '0'){
                actions.push(ind);
            }
            ind++;
        }
    });
    return actions;
}

export function updateBoard(board:Array<any[]>, action:number,player:string,clone:boolean){
    // board -> board[0] -> player1's positions
    // board -> board[1] -> player2's positions
    // board -> board[2] -> The actual board
    let new_board
    if (clone)
        new_board = structuredClone(board);
    else 
        new_board = board
    let currentpos=[(action/3) | 0,action%3]
    const player1_pos:number[] = new_board[0]    
    const player2_pos: number[] = new_board[1]    
    const actual_board = new_board[2]
    actual_board[currentpos[0]] = actual_board[currentpos[0]].substring(0,currentpos[1]) +  
            player + actual_board[currentpos[0]].substring(currentpos[1]+1)
    let last_move = -1;
    if (player == "1"){
        player1_pos.push(action)
        if (player1_pos.length == 4){
            last_move = player1_pos[0]
            player1_pos.splice(0,1)
        }
    }else {
        player2_pos.push(action)
        if (player2_pos.length == 4){
            last_move = player2_pos[0]
            player2_pos.splice(0,1)
        }
    }
    if (last_move != -1){
        const last_pos = [(last_move / 3) | 0, (last_move % 3)]
        actual_board[last_pos[0]] = actual_board[last_pos[0]].substring(0,last_pos[1]) +  
            "0" + actual_board[last_pos[0]].substring(last_pos[1]+1)
    }
    // console.log(new_board)
    return new_board;
}

function scoreFunc(board_comb:Array<any[]>,player:string):number{
    let diagonal = "";
    let oppositeDiagonal = "";
    const board = board_comb[2]
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

const solver = new MinMax(checkWinner,scoreFunc,getActions,updateBoard,5,2,1);

export function getAIMove(board: Array<any[]>,aiplayer:number){

    solver.aiPlayer = aiplayer

    // if (filledBlocks <= 2){
    //     let equalActions = getActions(board)
    //     return equalActions[((Math.random() * 100) | 0) % equalActions.length]
    // }

    let max_val  = solver.maxVal(structuredClone(board),1,-999999,99999);
    

    return [max_val[1] / 3 | 0, max_val[1] % 3];

}