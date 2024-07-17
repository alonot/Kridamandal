import { MinMax } from "./MinMax";
import { transposeStringMatrix } from "./TicTacToeHelpers";

export function updateBoard(board:Array<string>,row_no:number, player_no:string,clone:boolean):Array<string>{
    let prev = -1
    // console.log("updating")
    if (clone)
        board =  structuredClone(board);
    if (row_no == -1){return board;}
    for (let i = 0; i < board.length; i++){
        if (board[i].at(row_no) != '0' ){
            break;
        }
        prev = i
    }
    if (prev != -1){
        board[prev] = board[prev].substring(0,row_no) + player_no + board[prev].substring(row_no+1);  
    }
    
    return board;
}

export function isTerminalState(board:Array<string>):boolean{
    for (let i = 0; i < board[0].length; i++){
        if (board[0].at(i) == "0"){
            return false
        }
    }
    return true
}

export function getActions (board:Array<string>):Array<number>{
    let actions :Array<number>= []
    for (let i = 0; i < board[0].length; i++){
        if (board[0].at(i) == '0') actions.push(i)
    }
    return actions
}

function flipMat(board:Array<string>){
    let new_arr:Array<string> = board.map((row)=> {
        // return row.split('').reverse().join('')
        let new_row = ""
        row.split('').forEach(ch => {
            new_row = ch + new_row;
        });
        return new_row
    })
    return new_arr
}

export function ScoreFunc(board:Array<string>,player:string){
    var twoplaces1 = `${player}${player}00`
    var twoplaces2 = `${player}0${player}0`
    var twoplaces3 = `0${player}0${player}`
    var twoplaces4 = `00${player}${player}`
    var twoplaces5 = `0${player}${player}0`
    var threeplaces1 = `${player}${player}${player}0`
    var threeplaces2 = `${player}${player}0${player}`
    var threeplaces3 = `${player}0${player}${player}`
    var threeplaces4 = `0${player}${player}${player}`

    function getCount (row:string) : number{
        let count = 0
        // checking for 2 in row
        if (row.includes(twoplaces1)) count+=2;
        if (row.includes(twoplaces2)) count+=2;
        if (row.includes(twoplaces3)) count+=2;
        if (row.includes(twoplaces4)) count+=2;
        if (row.includes(twoplaces5)) count+=2;
        // checking for 3 in row
        if (row.includes(threeplaces1)) count+=3;
        if (row.includes(threeplaces2)) count+=3;
        if (row.includes(threeplaces3)) count+=3;
        if (row.includes(threeplaces4)) count+=3;
        
        return count
    }
   
    // helper function that check for winner in each ROW
    function checker(board:Array<string>):number{
        let count = 0
        for (let i =0; i< board.length;i++){
            count+= getCount(board[i])
        }
        return count
    }
 
    function checkOnDiagonal(board:Array<string>):number{
    let count = 0
     for (let i = board.length - 4; i >=-(board[0].length - 4);i--){
         let diagonal = ""
         let j,l;
         if (i > 0){
             l = 0
             j = i;
         }else{
             j = 0
             l = -i;
         }
         for (; j< board.length && l < board[0].length ; j++){
             diagonal += board[j].at(l++)
         }
         count += getCount(diagonal)
     }
     return count
    }
 
    return checker(board) + checker(transposeStringMatrix(board)) + checkOnDiagonal(board) + checkOnDiagonal(flipMat(board))
}

export function CheckWinner(board:Array<string>,player_no:number):boolean{
    var player = player_no.toString()
    var toCheck = player.repeat(4)
   
   // helper function that check for winner in each ROW
   function checker(board:Array<string>):boolean{
       for (let i =0; i< board.length;i++){
           if (board[i].includes(toCheck)){
               return true
            }
       }
       return false
   }

   function checkOnDiagonal(board:Array<string>):boolean{
    for (let i = board.length - 4; i >=-(board[0].length - 4);i--){
        let diagonal = ""
        let j,l;
        if (i > 0){
            l = 0
            j = i;
        }else{
            j = 0
            l = -i;
        }
        for (; j< board.length && l < board[0].length ; j++){
            diagonal += board[j].at(l++)
        }
        if (diagonal.includes(toCheck)){
            return true
        }
    }
    return false
   }

   return checker(board) || checker(transposeStringMatrix(board)) || checkOnDiagonal(board) || checkOnDiagonal(flipMat(board))
}

const solver = new MinMax(CheckWinner,ScoreFunc,getActions,updateBoard,2,2,0);

export function updateLevel(level:number){
    solver.maxdepth = level
}

export function getAIMove(board:Array<string>,ainumber:number){
    // console.log("Next"+solver.maxdepth)
    let startTime = performance.now()
    let max_val  = solver.maxVal(structuredClone(board),1,-999999,99999);
    // console.log("Time taken:" + (performance.now() - startTime) + "ms")

    return max_val[1];
}