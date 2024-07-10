<script lang="ts">
    import { onMount } from "svelte";
    import { CheckWinner, getAIMove, isTerminalState, updateBoard,updateLevel } from "./Helpers/Connect4Helper";
    import { GAMEMODE } from "./Helpers/util";

    export let gameMode:number;
    export let displayPopUp:Function;

    $: player1Score = 0
    $: player2Score = 0
    $: currentPlayer = 1;
    $: level = 2
    $: message = "Higher AI levels may take upto 0.7sec to play their turn"
    let board:Array<string> =[];
    const sevenNums = [0,1,2,3,4,5,6]
    let nextMoveAvailable:boolean = false
    let circleDiv:HTMLCollectionOf<HTMLElement>
    let isplaying = false
    

    let dropRow: number = -1;
    for (let i =0; i < 6; i++){
        let newArr = "0".repeat(7)
        board.push(newArr)
    }
    const padding = 15
    
    onMount(()=> {
        let boardDiv = document.getElementsByClassName("board")[0] as HTMLElement
        circleDiv = document.getElementsByClassName("topcircle") as HTMLCollectionOf<HTMLElement>
        const dropDown = document.getElementsByTagName("select")[0] as HTMLSelectElement
        let bounds:DOMRect,width:number;
        setTimeout(()=>{
            if (boardDiv != null){
                bounds = boardDiv.getBoundingClientRect()
                width = bounds.width - 30
            }
        },1000)


        if (dropDown != null){
            dropDown.onchange = (e) => {
                e.preventDefault()
                if (!isplaying){
                    level = (Number.parseInt(dropDown.options[dropDown.selectedIndex].value))
                    updateLevel(level)
                }else{
                    dropDown.selectedIndex = level - 1
                }
                
            }
        }


        boardDiv.onmousemove = (e) => {
            e.preventDefault()
            if (bounds!=null && nextMoveAvailable){
                if ( bounds.left + padding < e.clientX && bounds.right - padding> e.clientX  && 
                                bounds.top + padding < e.clientY && bounds.bottom - padding  > e.clientY) {
                    const offsetX = e.clientX - bounds.left - 15
                    dropRow = ((offsetX / width * 7) | 0)
                }
            }
        }
        boardDiv.onmouseleave=(e)=> {
            dropRow = -1;
        }
        boardDiv.onclick = (e) => {
            e.preventDefault()
            if (isplaying == false){
                // count the clicks and send a pop on say x clicks that "Please click the play button"
            }
            if (nextMoveAvailable){
                updateGame()
                nextTurn()
            }
            
        }
    })


    const play = () => {
        nextMoveAvailable = true
        if (isplaying){
            reset()
            return
        }else{
            isplaying = true
        }
        nextTurn()
    }

    const updateGame = () => {
        // console.log(dropRow)
        if(dropRow == -1) return
        board = updateBoard(board,dropRow,currentPlayer == 0 ? "1" : "2",false)
        nextMoveAvailable = false

        dropRow = -1
        
        // =========
        const circle_div = circleDiv.item(dropRow)
        if (circleDiv != null){
            
        }
        // =========
        setTimeout(() => {
            // since currentplayer had already changed so we check inverse
            if (CheckWinner(board,currentPlayer == 1 ? 1 : 2) && isplaying){
                if (currentPlayer == 1){    
                    player1Score++
                }else{
                    player2Score++
                }
                isplaying = false
                displayPopUp(
                    "message",
                    "Winner is : Player" + (currentPlayer + 1),
                    5000
                )
                setTimeout(() => {
                    nextGame()
                    isplaying = true
                }, 5000);
            }else if (isTerminalState(board)){
                displayPopUp(
                    "message",
                    "Game Over",
                    5000
                )
                
                setTimeout(() => {
                    nextGame()
                }, 5000);
                
            }
            nextMoveAvailable = true
        }, 1000);
        currentPlayer = (currentPlayer + 1) % 2
    }


    const nextTurn = () => {
        if (gameMode == GAMEMODE.AI){
            if (currentPlayer == 1){
                nextMoveAvailable = false
                setTimeout(() => {
                    
                    dropRow = getAIMove(board,2)
                    console.log("Ai")
                    updateGame()
                }, 600);
            }
        }else if (gameMode == GAMEMODE.MULTIPLAYER){
            // get move online
        }
    }

    const nextGame = () => {
        board = []
        for (let i =0; i < 6; i++){
            let newArr = "0".repeat(7)
            board.push(newArr)
        }
    }

    const reset = () => {
        player1Score = 0
        player2Score = 0
        nextMoveAvailable = false
        dropRow = -1
        isplaying = false
        nextGame()
    }
</script>

<main>
    <div class="scoreBoard">
        <div class="heading">
            <strong><h1>CONNECT</h1></strong>
            <h2>FOUR</h2>
        </div>
        <div class="scoreArea">
            <div class="scoreCard" style=" --color:#cd2a2a;{currentPlayer == 0? "box-shadow: 0 0 100px red;border:5px solid red" : ""}">
                <p>{player1Score}</p>
            </div>
            <div class="scoreCard" style="--color:#F0F02E;{currentPlayer == 1? "box-shadow: 0 0 100px yellow;border:5px solid yellow" : ""}">
                <p>{player2Score}</p>
            </div>
        </div>
        <div class="fullwidth flex center">
            <button on:click={play}>{isplaying? "Reset" : "Play"}</button>
            {#if gameMode == GAMEMODE.AI}
                <select >
                    <optgroup label="Beginners">
                        <option value=2>Level 1</option>
                        <option value=3>Level 2</option>
                    </optgroup>
                    <optgroup label="Intermediate">
                        <option value=4>Level 4</option>
                        <option value=5>Level 5</option>
                        <option value=6>Level 6</option>
                    </optgroup>
                    <optgroup label="Pro">
                        <option value=7>Level 7</option>
                        <option value=8>Level 8</option>
                    </optgroup>
                </select>
            {/if}
        </div>
        {#if gameMode == GAMEMODE.AI}
        <p class="messagebox">{message}</p>
        {/if}
    </div>
    <div class="rest">
        <div class="boardDiv">
            <tr class="row topRow">
                {#each sevenNums as val}
                <div class="circle topcircle">
                    <svg class="light" height="55" width="55" xmlns="http://www.w3.org/2000/svg" style="display: {dropRow == val? "block" : "none"};">
                        <circle r="24" cx="27.5" cy="27.5" stroke-width="1" fill={currentPlayer == 0 ? "#cd2a2a" : "#F0F02E"}  />
                    </svg>
                </div>
            {/each}
            </tr>
            <table class="board">
                {#each board as row_string }
                    <tr class="row">
                        {#each row_string.split('') as val,ind}
                            <div class="circle">
                                <svg class="{dropRow == ind ? "light" : ""}" height="55" width="55" xmlns="http://www.w3.org/2000/svg"  >
                                    <circle r="24" cx="27.5" cy="27.5" stroke-width="1" fill={val == "1" ? "#cd2a2a" : val == "2" ? "#F0F02E" : "#121212"} />
                                </svg>
                            </div>
                        {/each}
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</main>

<style>
    .flex{
        display: flex;
    }
    .center{
        align-items: center;
        justify-content: space-evenly;
    }
    select{
        background-color: #1a1a1a;
        height: 40px;
        width: 100px;
        border-radius: 10px;
        padding: 10px;
        font-weight: bold;
        border: none;
    }
    main{
        --neon-effect: 0 0 0 transparent,
    0 0 20px rgb(255, 0, 0),
    0 0 50px rgba(255, 0, 0,.5),
    0 0 200px rgba(255, 0, 0, .5),
    0 0 250px rgba(255, 0, 0, 1),
    0 0 300px rgba(255, 0, 0, 1),
    -250px -100px 100px rgba(255, 0, 0, 1)
  ; 
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
    }

    .messagebox{
        margin-top: 20px;   
        text-align: center;
        font-size: smaller;
    }

    h1,h2{
        margin:0;
    }
    svg{
        background-color: #263238;
    }

    .topcircle{
        z-index: 5;
        
    }
    
    .board{
        border: 10px solid #20282d;
        border-radius: 10px;
        padding: 5px;
    }
    .circle{
        padding: 0;
        min-height: 55px;
        height: 55px;
        min-width: 55px;
        width: 55px;
        transition: all 0.8s ease-in;
    }
    .topRow{
        margin-left: 15px;
    }
    .row{
        min-height: 55px;
        height: 55px;
        max-height: 50px;
        display: flex;
    }
    table{
        border-spacing: 0;
    }
    .light{
        background-color: #607D8B;
    }
    .scoreArea{
        display: flex;
        margin: 30px 5px;
    }
    .scoreCard{
        width: 150px;
        height: 150px;
        margin:10px;
        background-color: var(--color);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .scoreCard p{
        color: black;
        font-weight: bold;
        font-size: 40px;
    }
    .heading{
        padding: 10px;
        margin-left: 20px;
        font-weight: bold;
        width: 100%;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        text-shadow: var(--neon-effect);
        /* text-shadow: -5px 4px 3px gray; */
    }
    .heading h1{
        font-size: 70px;
        line-height: 0.8;
    }
    .heading h2{
        font-weight: 900;
        font-size: 45px;
        text-indent: 5px;
        line-height: 0.8;
    }
    .scoreBoard{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex:2.5;
    }
    .rest{
        flex: 3;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    button {
        width: 100px;
    }

    @media (max-width:900px){
        main{
            flex-direction: column;
        }
        .scoreCard{
            width: 75px;
            height: 75px;
        }
        .scoreCard p{
            font-size: 25px;
        }
        .scoreBoard{
            margin-top: 4rem;
            flex : 3;
        }
        .scoreArea{
            margin: 15px 5px;
        }
        .heading h1{
            font-size: 50px;
        }
        .heading h2{
            text-indent: 0;
            font-size: 33px;
        }
        .boardDiv{
            scale: 0.6;
            margin-top: -4rem;
        }
        .heading{
            text-align: center;
        }
    }
    
</style>