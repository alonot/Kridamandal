<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { checkWinner, getAIMove } from "./Helpers/TicTacToeHelpers";
    import { GAMEMODE } from "./Helpers/util";
    
    export let gameMode:number;
    export let displayPopUp:Function;

    let board:HTMLDivElement
    // initialization
    // =======
    let boardvalues=["000","000","000"]  // used to check winner
    let currentplayer=0
    $: isplaying=false
    $: player1=0 // score of player1
    $: gotwinner=false 
    $: player2=0 // score of player2
    $: div=["","","","","","","","",""] // the array which is shown on the user screen
    $: filled_blocks = 0 // counts the nuber of filled blocks
    //  ==============


    onMount(()=>{
        boardvalues=["000","000","000"]
        // Setting the rotation of board on mousemove
        document.onmousemove=(e)=>{
            if (!isplaying && board != null){
                // board.style.transform=`rotateX(0deg) rotateY(360deg)`
                //  console.log(e) 
                const dim=(board.getBoundingClientRect())
                //  console.log(dim)
                if (dim.left < e.clientX && dim.right> e.clientX && dim.top < e.clientY && dim.bottom > e.clientY) {
                    let posX=e.clientX-dim.left;
                    let posY=e.clientY-dim.top;
                    let percenX=Number(posX/dim.width*60)
                    let percenY=Number(posY/dim.height*60)
                    percenX=(percenX<30)?percenX:percenX-60
                    percenY=(percenY>30)?percenY:percenY-60
                    board.style.transform=`rotateX(${percenX}deg) rotateY(${percenY}deg)`
             }else{
                board.style.transform=`rotateX(-30deg) rotateY(30deg)`
            }
            }
        }
    })

    /**
     * Handles the click of the user on the borad
     * @param index
     */
    function handleclick(index:number){
        if (div[index] == ""){
            if (updateBoard(index)){
                return;
            }
            nextTurn()
            
        }
    }

    function updateBoard(index:number):Boolean{
        div[index]=currentplayer==0?'X':'O'
            let currentpos=[(index/3) | 0,index%3]
            
            boardvalues[currentpos[0]] = boardvalues[currentpos[0]].substring(0,currentpos[1]) +  
            ((currentplayer==0)?"1":"2") + boardvalues[currentpos[0]].substring(currentpos[1]+1)
            
            filled_blocks++;

            // Checks for winner
            if (checkWinner(boardvalues,currentplayer == 0 ? 1: 2)){
                let winner=currentplayer
                if(winner==0){
                    player1+=1
                }else if(winner==1){
                    player2+=1
                }
                board.style.pointerEvents="none"
                board.style.filter="blur(5px)"
                gotwinner=true
                setTimeout(() => {
                    reset(true)
                    nextTurn()
                }, 2000);
                return true;
            }
            
            if (filled_blocks==9){
                // reset the visual board
                board.style.pointerEvents="none"
                board.style.filter="blur(5px)"
                setTimeout(() => {
                    reset(true);
                    nextTurn();
                }, 2000);
                return true;
            }

            currentplayer=(currentplayer+1)%2
            return false;
    }

    function nextTurn(){
        if (gameMode == GAMEMODE.AI){ // AI
            if (currentplayer == 1){
                moveAi();
            }
        }else if (gameMode == GAMEMODE.MULTIPLAYER){
            // const nextMOVE = GETNEXTMOVE(thisplayermove = index)
            // displayMove()
        }else if (gameMode == GAMEMODE.OFFLINE){
            // Eat a 5-star, Do nothing.
        }
    }


    function moveAi(){
        const AIMove = getAIMove(boardvalues,2,filled_blocks);
        updateBoard(AIMove);
        
    }

    /**
     * Starts the game
     */
    const play=() => {
        if (gameMode == GAMEMODE.MULTIPLAYER){
            displayPopUp(
                "Message",
                "This mode is not available to play at this moment.Sorry for the inconvenience",
                0
            )
            return
        }
        reset(false)
        player1=0
        player2=0
        isplaying=true
        nextTurn()
    }
    
    /**
     * Resets the game with a parameter(willplay) that if players are going to continue the game or not .
     * @param willplay
     */
    const reset=(willplay:boolean) => {
        isplaying=willplay
        div=["","","","","","","","",""]
        board.style.pointerEvents="auto"
        boardvalues=["000","000","000"]
        filled_blocks = 0;
        gotwinner=false
        board.style.filter="blur(0px)"
        currentplayer=(currentplayer+1)%2
    }

</script>

<main id="tictactoe">
    <div class="scorecardholder" id="scorediv1">
        <div class="scorerHolder">
            <svg viewBox="0 0 530 530" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color: rgb(224, 64, 251);"></stop>
                    <stop offset="100%" style="stop-color: rgb(255, 23, 68);"></stop>
                  </linearGradient>
                </defs>
                <path fill="url(#gradient)">
                    <animate attributeName="d"
                        dur="10000ms"
                        repeatCount="indefinite"

                        values="M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;
                        
                        M386.5,303.5Q377,357,324.5,367Q272,377,216
                        ,391.5Q160,406,109.5,362.5Q59,319,47.5,
                        245.5Q36,172,84,108.5Q132,45,204,74.5Q276,
                        104,353,101.5Q430,99,413,174.5Q396,
                        250,386.5,303.5Z;
                        
                        M369.5,297Q362,344,320.5,378Q279,412,219,
                        409.5Q159,407,133,354.5Q107,302,79.5,240Q52,
                        178,102,129Q152,80,222.5,44.5Q293,9,334.5,
                        76.5Q376,144,376.5,197Q377,250,369.5,297Z;
                        
                        M382.5,307Q386,364,331.5,383.5Q277,403,
                        210.5,418Q144,433,84.5,382.5Q25,332,61.5,
                        263.5Q98,195,114,118.5Q130,42,210,
                        31.5Q290,21,327,88Q364,155,371.5,202.5Q379,
                        250,382.5,307Z;
                        
                        M413,314.5Q404,379,348,434Q292,489,219.5,459Q147,
                        429,121.5,367.5Q96,306,96,250Q96,194,125.5
                        ,139.5Q155,85,214.5,101Q274,117,334,123.5Q394,
                        130,408,190Q422,250,413,314.5Z;
                        
                        M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;"
                    ></animate>
                </path>
              </svg>
        </div>
        <span style="z-index: 2;" class="counter">{player1}</span>
        <div class="scorerHolder">
            <svg viewBox="0 0 530 530" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color: rgb(224, 64, 251);"></stop>
                    <stop offset="100%" style="stop-color: rgb(255, 23, 68);"></stop>
                  </linearGradient>
                </defs>
                <path fill="url(#gradient)" class="pather">
                    <animate attributeName="d"
                        dur="10000ms"
                        repeatCount="indefinite"

                        values="M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;
                        
                        M386.5,303.5Q377,357,324.5,367Q272,377,216
                        ,391.5Q160,406,109.5,362.5Q59,319,47.5,
                        245.5Q36,172,84,108.5Q132,45,204,74.5Q276,
                        104,353,101.5Q430,99,413,174.5Q396,
                        250,386.5,303.5Z;
                        
                        M369.5,297Q362,344,320.5,378Q279,412,219,
                        409.5Q159,407,133,354.5Q107,302,79.5,240Q52,
                        178,102,129Q152,80,222.5,44.5Q293,9,334.5,
                        76.5Q376,144,376.5,197Q377,250,369.5,297Z;
                        
                        M382.5,307Q386,364,331.5,383.5Q277,403,
                        210.5,418Q144,433,84.5,382.5Q25,332,61.5,
                        263.5Q98,195,114,118.5Q130,42,210,
                        31.5Q290,21,327,88Q364,155,371.5,202.5Q379,
                        250,382.5,307Z;
                        
                        M413,314.5Q404,379,348,434Q292,489,219.5,459Q147,
                        429,121.5,367.5Q96,306,96,250Q96,194,125.5
                        ,139.5Q155,85,214.5,101Q274,117,334,123.5Q394,
                        130,408,190Q422,250,413,314.5Z;
                        
                        M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;"
                    ></animate>
                </path>
              </svg>
        </div>
    </div>
    <div class="Main_Container">
        <div class="textBox">
            <center>
                <h1>
                    <span class="heading fonter">Tic Tac Toe</span><br>
                </h1>
            </center>   
        </div>
        <center>
        <button class="playbtn" on:click={play}>PLAY
        </button></center>
        <center>
            <div class="chanceholder">  
                <button class="displaybtn" id={currentplayer==0?"Xdisplay":""} disabled on:click={play}>X
                </button>
                <button class="displaybtn" id={currentplayer!=0?"Odisplay":""} disabled on:click={play}>O
                </button>
        </div>  
        </center>
        
        <div class="boarddiv">
            <center>
            <div class="board" bind:this={board} style="{isplaying?'transform:  rotateX(0deg) rotateY(360deg); box-shadow:0 0 120px #907603;0 0 120px #907603;0 0 120px #907603;0 0 120px #907603;':''}">
                <div class="top covers"></div>
                <div class="cube">
                    <span style="--i:0; {isplaying?'background: #f1d039; border:5px black solid; box-shadow:0 0 50px black;':''} " class="side">
                        {#if isplaying}
                            <div in:fade={{delay:500,duration:500}} out:fade={{delay:0,duration:500}} class="playboard" style="opacity:100%;">
                                <div class="item {div[0]}" on:click={()=>{handleclick(0)}}></div>
                                <div class="item {div[1]}" on:click={()=>{handleclick(1)}}></div>
                                <div class="item {div[2]}" on:click={()=>{handleclick(2)}}></div>
                                <div class="item {div[3]}" on:click={()=>{handleclick(3)}}></div>
                                <div class="item {div[4]}" on:click={()=>{handleclick(4)}}></div>
                                <div class="item {div[5]}" on:click={()=>{handleclick(5)}}></div>
                                <div class="item {div[6]}" on:click={()=>{handleclick(6)}}></div>
                                <div class="item {div[7]}" on:click={()=>{handleclick(7)}}></div>
                                <div class="item {div[8]}" on:click={()=>{handleclick(8)}}></div>
                            </div>
                        {:else}
                        <center in:fade={{delay:500,duration:500}} out:fade={{delay:0,duration:250}} >Tic Tac Toe</center>
                        {/if}
                            
                    </span>
                    <span class="side right" style=   "--i:1; width:100px; transform:translateX(250px) rotateY(90deg)"><center>Tic Tac Toe</center></span>
                    <span class="side" style="--i:2; color:#f2c969;"><center>Tic Tac Toe</center></span>
                    <span class="side" style="--i:3; width:100px; color:#f2c969"><center>Tic Tac Toe</center></span>
                </div>
                <div class="bottom covers"></div>
            </div></center>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="reset" on:click={() => reset(false)} style="background-color: green; transform: rotateY({isplaying?'0deg':'90deg'}); {gotwinner?"pointer-events:none":""}"></div>
        </div>
    </div>
    <div class="scorecardholder" id="scorediv2">
        <div class="scorerHolder">
            <svg viewBox="0 0 530 530" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color: rgb(224, 64, 251);"></stop>
                    <stop offset="100%" style="stop-color: rgb(255, 23, 68);"></stop>
                    </linearGradient>
                </defs>
                <path fill="url(#gradient)" class="pather">
                    <animate attributeName="d"
                        dur="10000ms"
                        repeatCount="indefinite"

                        values="M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;
                        
                        M386.5,303.5Q377,357,324.5,367Q272,377,216
                        ,391.5Q160,406,109.5,362.5Q59,319,47.5,
                        245.5Q36,172,84,108.5Q132,45,204,74.5Q276,
                        104,353,101.5Q430,99,413,174.5Q396,
                        250,386.5,303.5Z;
                        
                        M369.5,297Q362,344,320.5,378Q279,412,219,
                        409.5Q159,407,133,354.5Q107,302,79.5,240Q52,
                        178,102,129Q152,80,222.5,44.5Q293,9,334.5,
                        76.5Q376,144,376.5,197Q377,250,369.5,297Z;
                        
                        M382.5,307Q386,364,331.5,383.5Q277,403,
                        210.5,418Q144,433,84.5,382.5Q25,332,61.5,
                        263.5Q98,195,114,118.5Q130,42,210,
                        31.5Q290,21,327,88Q364,155,371.5,202.5Q379,
                        250,382.5,307Z;
                        
                        M413,314.5Q404,379,348,434Q292,489,219.5,459Q147,
                        429,121.5,367.5Q96,306,96,250Q96,194,125.5
                        ,139.5Q155,85,214.5,101Q274,117,334,123.5Q394,
                        130,408,190Q422,250,413,314.5Z;
                        
                        M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;"
                    ></animate>
                </path>
                </svg>
        </div>
        <span style="z-index: 2;" class="counter">{player2}</span>
        <div class="scorerHolder">
            <svg viewBox="0 0 530 530" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color: rgb(224, 64, 251);"></stop>
                    <stop offset="100%" style="stop-color: rgb(255, 23, 68);"></stop>
                    </linearGradient>
                </defs>
                <path fill="url(#gradient)">
                    <animate attributeName="d"
                        dur="10000ms"
                        repeatCount="indefinite"

                        values="M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;
                        
                        M386.5,303.5Q377,357,324.5,367Q272,377,216
                        ,391.5Q160,406,109.5,362.5Q59,319,47.5,
                        245.5Q36,172,84,108.5Q132,45,204,74.5Q276,
                        104,353,101.5Q430,99,413,174.5Q396,
                        250,386.5,303.5Z;
                        
                        M369.5,297Q362,344,320.5,378Q279,412,219,
                        409.5Q159,407,133,354.5Q107,302,79.5,240Q52,
                        178,102,129Q152,80,222.5,44.5Q293,9,334.5,
                        76.5Q376,144,376.5,197Q377,250,369.5,297Z;
                        
                        M382.5,307Q386,364,331.5,383.5Q277,403,
                        210.5,418Q144,433,84.5,382.5Q25,332,61.5,
                        263.5Q98,195,114,118.5Q130,42,210,
                        31.5Q290,21,327,88Q364,155,371.5,202.5Q379,
                        250,382.5,307Z;
                        
                        M413,314.5Q404,379,348,434Q292,489,219.5,459Q147,
                        429,121.5,367.5Q96,306,96,250Q96,194,125.5
                        ,139.5Q155,85,214.5,101Q274,117,334,123.5Q394,
                        130,408,190Q422,250,413,314.5Z;
                        
                        M413.5,322Q421,394,351.5,413Q282,
                        432,210,438Q138,444,83,387.5Q28
                        ,331,28.5,250Q29,169,102,144.5Q175,
                        120,230.5,83.5Q286,47,340,88Q394,129
                        ,400,189.5Q406,250,413.5,322Z;"
                    ></animate>
                </path>
                </svg>
        </div>
    </div>
</main>

<style>
    main{
        width: 100vw;
        display: flex;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: rgb(0, 0, 0);
        justify-content: center;
        background-attachment:fixed;
        background-image: url('/src/assets/img.jpg');
        background-size: cover;
        /* min-width: 1120px; */
        min-height: 700;
    }
    h1{
        min-width: 190px;
        max-height: 40px;
    }
    .Main_Container{    
        display: flexbox;
        height: 100%;
        width:50%
    }
    #scorediv1{
        left: 50px;
    }
    .scorecardholder{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25%;
        min-height: 100vh;
    }
    .scorerHolder{
        position: absolute;
        width: 400px;
        height: 400px;
        transition: all 0.5s;
    }
    .scorerHolder:nth-child(2),.scorerHolder:nth-child(3){
        filter: blur(50px);
    }
    .scorerHolder:hover{
        transform: rotateY(20deg) rotateX(-5deg) rotateZ(2deg);
    }
    .chanceholder{
        display: grid;
        grid-template-columns: auto auto;
        align-content: center   ;
        margin-top: 20px;
        width: 80%;
        align-self: center;
    }
    .displaybtn{
        margin: 0 auto;
        align-self: center;
        background: linear-gradient(rgb(110, 71, 71),rgb(110, 37, 110));
    }
    #Xdisplay{
        box-shadow: 0 0 20px rgb(41, 129, 231);
        border: 2px blue solid;
    }
    #Odisplay{
        border: 2px red solid;
        box-shadow: 0 0 20px rgb(231, 41, 41),0 0 20px rgb(88, 44, 44);
    }
    .pather{
        display: flex;
        align-content: center;
        justify-self: center;
    }
    .textBox{
        display: inline-block;
        height: 30%;   
        width: 100%;
    }
    .fonter{
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-style: italic;
        font-weight: bold;
    }
    .heading{
        width: fit-content;
        max-lines: 1;
        text-align: center;
        font-size: 100px;
        -webkit-text-fill-color: transparent;   
        text-shadow: 8px 8px #fff, 15px 15px #494444;
    }
    .board{
        cursor:grab;
        z-index: 3;
        position: relative;
        width: 300px;
        height: 300px;
        transform-style: preserve-3d;
        transition: all 1s;
        color:#f2c969;  
        transform:  rotateX(-30deg) rotateY(30deg);
    }
    .board:active{
        cursor: grabbing    ;
    }
    .boarddiv{
        width: 100%;
        position: relative;
        align-self: center;
        top: 70px;
    }
    .playbtn{
        margin-top: 30px;
    }
    .cube{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
    }
    .board:hover{
        transform: rotateX(-10deg) rotateY(20deg);
    }
    .playboard{
        display: grid;  
        height: 280px;
        margin: 10px;
        grid-template-columns: auto auto auto;
    }
    #blobSvg{
        display: flex;
        align-items: center;
        justify-items: center;
    }
    .side{
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        transition: all 2s;
        width: 100%;    
        box-shadow: 0 0 5px black;
        background: linear-gradient( #222222, #f1d039);
        height: 100%;
        transform: rotateY(calc(90deg * var(--i))) translateZ(50px);
        
    }
    .covers{
        position: absolute;
        top: 0px;
        left: 0;
        height: 100px;
        width: 300px;
        background: rgb(37, 37, 37);
    }
    .top{
        transform: rotateX(90deg) translateZ(50px);
    }
    .bottom{
        transform: rotateX(90deg) translateZ(-250px);
    }
    .bottom::before{
        content: 'hel';
        position: absolute;
        top: 0;
        left: 0;
        height: 100px;
        width: 300px;
        background: #f1d039;
        box-shadow: 0 0 120px #f1d039, 0 0 120px yellow, 0 0 120px yellow, 0 0 120px yellow;
    }
    .reset{
        width:15px;
        height: 15px;
        border-radius: 15px;
        position: absolute;
        right:70px;
        transition: all 2s;
        left: auto;
        cursor: pointer;
    }
    .item{
        padding: 10px;
        background-size: cover;
        background-position: center;
        border: 2px rgb(61, 57, 57) solid;
    }
    .item:active{
        cursor: pointer;
    }
    .counter{
        font-size: 200px;
        font-weight: bold;
        display: flex;
        margin-left: -40px;
    }
    .X{
        background-image: url('/src/assets/X-symbol.svg');
    }
    .O{
        background-image: url('/src/assets/O-symbol.svg');
    }
    @media(max-width:900px){
        main , #tictactoe{
        width: 100vw;
        min-width: 0px;
        height: 100vh;
        display: grid;
        row-gap: 0;
        column-gap: 0;
        grid-template-columns: auto auto;
        background-repeat: repeat-y;
        align-content: space-between;
    }
    h1{
        width: 50%;
    }
    .displaybtn{
        margin: 0 auto;
    }
    .heading{
        font-size: 40px;
        margin: 0;
        display: flex;
        align-self: center;
    }
    .Main_Container{
        grid-row: 1;
        grid-column: 1;
        grid-column-start: 1;
        grid-column-end: 2;
        margin: 0 auto;
        top : -4em;
        position: relative;
        width: 100vw;
    }
    .scorecardholder{
        height: 150px;
        width: 50%;
        max-width: 50vw;
        position: relative;
        bottom: 2em;
        min-height: 150px;
    }
    #scorediv1{
        left: 0;
        width: auto;
        grid-row: 2;
        grid-column: 1;
    }
    #scorediv2{
        grid-row: 2;
        right: 15vw;
        grid-column: 2;
    }
    .scorerHolder{
        height: 150px;
        width: 150px;
    }
    .counter{
        font-size: 40px ;
    }
    .textBox{
        max-height: 80px;
        max-lines: 1;
        align-self: center;
    }
    .reset{
        right: 0;
    }
    .board{
        margin-top: -15px;
    }
    .Main_Container{
        scale: 0.8;
    }
    }
</style>