<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { checkWinner, getAIMove, updateBoard } from "$lib/Helpers/InfiniteTicTac";
    import cross from "$lib/assets/cross.svg"
    import circle from "$lib/assets/circle.svg"
    
    import { DIALOG, GAMEMODE, LOADING } from "$lib/Helpers/util";
    import type { Room } from "$lib/Helpers/room";

    export let gameMode: number;
    export let room: Room;
    const loading: Function = getContext(LOADING);
    export const handleMultiplayer = (data: { [key: string]: any }) => {
        const type = data.type;
        // console.log("Handling: " + type);
        switch (type) {
            case "create_board":
                resetMultiplayer();
                currentplayer = data.data.current_player;
                isplaying = true;
                handleMultiMove(-1,-1);
                break;

            case "play":
                const move_info = data.data;
                currentplayer = move_info["current_player"];
                // play the move
                let currentpos = move_info["move"];
                if (currentpos[0] != -1 && currentpos[1] != -1){
                    updateBoardValues(currentpos[0],currentpos[1])
                    currentplayer = (currentplayer + 1) % 2;
                    handleMultiMove(-1,-1);
                }

                break;

            case "won":
                const won_info = data.data;
                isplaying = false;
                loading(false, "");
                const player = won_info["currPlayer"];
                if (player == 0) {
                    player1++;
                } else {
                    player2++;
                }
                isplaying = false;
                // console.log(won_info);
                displayPopUp(
                    "message",
                    "Winner is : " + won_info["won"],
                    3000,
                    () => resetMultiplayer(),
                );
                break;

            case "draw":
                isplaying = false;
                loading(false, "R");
                displayPopUp("message", "Game Over", 3000, () => {
                    resetMultiplayer();
                });
                break;
        }
    };

    const displayPopUp: Function = getContext(DIALOG);

    let board: HTMLDivElement;
    // initialization
    // =======
    $: boardvalues = ["000", "000", "000"]; // used to check winner
    let player1pos: number[] = []
    let player2pos: number[] = []
    let currentplayer = 0;
    let isplaying = false;
    let player1 = 0; // score of player1
    let gotwinner = false;
    let player2 = 0; // score of player2
    let nextMoveAvailable = false
    // ==== For multiplayer ===
    let wrongClick = 3

    //  ==============

    let screenWidth = 901;
    onMount(() => {
        screenWidth = window.innerWidth
        boardvalues = ["000", "000", "000"];
    });

    /**
     * Handles the click of the user on the borad
     * @param index
     */
    function handleclick(posi: number,posj:number) {
        // console.log(posi + " " + posj)
        console.log(nextMoveAvailable)
        if (gameMode == GAMEMODE.MULTIPLAYER) {
            handleMultiMove(posi,posj);
        } else if (boardvalues[posi].at(posj) == "0" && nextMoveAvailable) {
            if (updateBoardLocal(posi,posj)) {
                return;
            }
            nextTurn(posi, posj);
        }
    }

    /**
     * Updates the board and other relevant variables
     * @param posi
     * @param posj
     */
    function updateBoardValues(posi : number, posj: number){
        const action = (posi * 3) + posj

        updateBoard([player1pos,player2pos,boardvalues], action, currentplayer == 0 ? "1" : "2", false)
        boardvalues = boardvalues  // to triger state
    }

    /**
     * Updates the board to show on UI, and checks for winner
     * @param posi
     * @param posj
     */
    function updateBoardLocal(posi: number,posj:number): Boolean {
        updateBoardValues(posi,posj)

        // Checks for winner
        if (checkWinner([[],[],boardvalues], currentplayer == 0 ? 1 : 2)) {
            let winner = currentplayer;
            if (winner == 0) {
                player1 += 1;
            } else if (winner == 1) {
                player2 += 1;
            }
            board.style.pointerEvents = "none";
            board.style.filter = "blur(5px)";
            gotwinner = true;
            setTimeout(() => {
                reset(true);
                nextTurn(-1, -1);
            }, 2000);
            return true;
        }

        currentplayer = (currentplayer + 1) % 2;
        return false;
    }

    function handleMultiMove(posi: number, posj: number) {
        if (room.device_player?.role == `player${currentplayer}`) {
            if (posi == -1 || posj == -1) {
                nextMoveAvailable = true
                loading(false, "");
                return;
            }
            let currentpos = [posi, posj];
            room.sendMove(currentpos);
        } else if (room.device_player?.role == "watcher") {
            loading(false, "");
            nextMoveAvailable = false
        } else {
            loading(true, "Waiting for the next Move");
            // if (wrongClick == 0){
            //     displayPopUp(
            //         "alert",
            //         "This is not your move",
            //         500,
            //         ()=>{wrongClick = 3}
            //     )
            // }
            // wrongClick --;
            // loading(false, "");
            nextMoveAvailable = false
        }
    }

    function nextTurn(posi :  number,posj: number) {
        if (gameMode == GAMEMODE.AI) {
            // AI
            if (currentplayer == 1) {
                nextMoveAvailable = false
                moveAi();
                nextMoveAvailable = true
            }else{
                nextMoveAvailable = true
            }
        } else if (gameMode == GAMEMODE.MULTIPLAYER) {
            // const nextMOVE = GETNEXTMOVE(thisplayermove = index)
            handleMultiMove(posi,posj);
            // displayMove()
        } else if (gameMode == GAMEMODE.OFFLINE) {
            // Eat a 5-star, Do nothing.
            nextMoveAvailable = true
        }
    }

    function moveAi() {
        let AIMove = getAIMove([player1pos,player2pos,boardvalues], 2);
        updateBoardLocal(AIMove[0],AIMove[1]);
    }

    /**
     * Starts the game
     */
    const play = () => {
        reset(false);
        player1 = 0;
        player2 = 0;
        isplaying = true;
        nextTurn(-1,-1);
    };

    /**
     * Same as reset() , but this does not touches isplaying, currentplayer
     */
    const resetMultiplayer = () => {
        boardvalues = ["000", "000", "000"];
        player1pos = []
        player2pos = []
        wrongClick = 3
        nextMoveAvailable = false
        gotwinner = false;
    };

    /**
     * Resets the game with a parameter(willplay) that if players are going to continue the game or not .
     * @param willplay
     */
    const reset = (willplay: boolean) => {
        isplaying = willplay;
        board.style.filter = "blur(0px)"
        board.style.pointerEvents = "auto";
        boardvalues = ["000", "000", "000"];
        player1pos = []
        player2pos = []
        nextMoveAvailable = false
        gotwinner = false;
        currentplayer = (currentplayer + 1) % 2;
        // console.log("resetting" + currentplayer)
    };
</script>

<main id="tictactoe">
    {#if screenWidth > 900}
    <div class="scoreArea">
        <div
            class="scoreCard"
            style=" --color:#cd2a2a;{currentplayer == 0
                ? 'box-shadow: 0 0 100px red;border:5px solid red'
                : ''}"
        >
            <p>{player1}</p>
        </div>
    </div>
    {/if}
    <div class="Main_Container">
        <div class="heading">
            <strong><h1>Infinite</h1></strong>
            <h2>Tic Tac Toe</h2>
        </div>
        {#if gameMode != GAMEMODE.MULTIPLAYER}
            <button class="playbtn" on:click={play}>{ isplaying ? "RESET" : "PLAY"} </button>
        {/if}
        <div class="board" bind:this={board}>
            {#each boardvalues as row_string,row_in }
                {#each  row_string.split('') as data,ind}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="cell" on:click={()=>{
                        handleclick(row_in,ind)
                    }}>
                    {#if data == '1'}
                        <img  src={cross} alt="X" transition:fade/>
                    {:else if data == '2'}
                        <img src={circle} alt="O" transition:fade/>
                    {/if}
                    </div>
                {/each}
            {/each}
        </div>        
    </div>
    <div class="scoreArea">
        {#if screenWidth <= 900}
        <div
            class="scoreCard"
            style=" --color:#cd2a2a;{currentplayer == 0
                ? 'box-shadow: 0 0 100px red;border:5px solid red'
                : ''}"
        >
            <p>{player1}</p>
        </div>
    {/if}
        <div
            class="scoreCard"
            style="--color:#5C6BC0;{currentplayer == 1
                ? 'box-shadow: 0 0 100px #3449be;border:5px solid #3449be'
                : ''}"
        >
            <p>{player2}</p>
        </div>
    </div>
</main>

<style>
    * {
        box-sizing: border-box !important;
    }
    main {
        width: 100vw;
        display: flex;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: rgb(0, 0, 0);
        justify-content: center;
        align-items: center;
        background-attachment: fixed;
        background-size: cover;
        height: 100vh;
        --neon-effect: 0 0 0 transparent, 0 0 20px rgb(255, 0, 0),
            0 0 50px rgba(0, 140, 255, 0.5), 0 0 200px rgba(255, 183, 0, 0.5),
            0 0 150px rgb(253, 0, 245), 0 -50px 250px rgb(89, 255, 0),
            0px -100px 100px rgb(100, 28, 28);
    }
    h1 {
        min-width: 190px;
        text-align: center;
        margin: 0;
    }
    h2{
        margin: 10px 0;
        text-align: center;
    }
    .Main_Container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 50%;
        gap: 20px;
        top: 50px;
    }
    .heading {
        padding: 10px;
        margin-left: 20px;
        font-weight: bold;
        width: 100%;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        text-shadow: var(--neon-effect);
        flex-direction: column; 
        /* text-shadow: -5px 4px 3px gray; */
    }
    .heading h1 {
        font-size: 70px;
        line-height: 0.8;
    }
    .heading h2 {
        font-weight: 900;
        font-size: 45px;
        text-indent: 5px;
        line-height: 0.8;
    }
    .playbtn {
        margin-top: 20px;
        width: fit-content;
    }
    .board{
        display: grid;
        grid-template-columns: auto auto auto;
        border: rgb(167, 109, 27) solid 2px;
        box-shadow: 0 0 15px inset rgba(255, 174, 0, 0.83), 0 0 25px inset rgba(255, 51, 0, 0.83), 0 0 35px inset rgba(179, 0, 255, 0.83),
        0 0 15px  rgba(255, 174, 0, 0.83), 0 0 25px  rgba(255, 51, 0, 0.83), 0 0 35px  rgba(179, 0, 255, 0.83); 
        padding: 5px;
    }
    .cell{
        width: max(50px,9vw);
        cursor: pointer;
        height: max(50px,9vw);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 5px inset rgba(255, 124, 2, 0.673)    
    }
    img{
        height: 40px;
        width: 40px;
    }
    .scoreArea {
        display: flex;
        margin: 30px 5px;
    }
    .scoreCard {
        width: 150px;
        height: 150px;
        margin: 10px;
        background-color: var(--color);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .scoreCard p {
        color: black;
        font-weight: bold;
        font-size: 40px;
    }
    @media (max-width: 900px) {
        main{
            flex-direction: column;
        }
        .heading {
            text-align: center;
        }
        .heading h1 {
            font-size: 50px;
        }
        .heading h2 {
            text-indent: 0;
            font-size: 33px;
        }
        h1 {
            width: 50%;
        }
        .heading {
            font-size: 20px;
            margin: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .scoreCard {
            width: 75px;
            height: 75px;
        }
        .scoreCard p {
            font-size: 25px;
        }
        .scoreArea {
            margin: 15px 5px;
        }
        .Main_Container {
            margin: 20px auto;
            width: 100vw;
        }
    }
</style>
