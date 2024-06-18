<script lang="ts">
    import { onMount } from "svelte";

    $: msg = "The Maze";
    $: sec = "45";
    $: color = "#04fc43";
    $: gameStarted = false;
    $: totalTime = 45;
    $: paused = false;
    let screenWidth: number;

    /**
     * Generates the Maze
     */
    let initializePath: Function;
    /**
     * Resets the Variables used by the games
     */
    let resetVariables: Function;
    /** Shows the loading bar while generating the maze */
    let showLoading: Function;
    /** Starts the timer*/
    let startTimer: Function;
    /** Hides the loading bar*/
    let closeLoading: Function;
    /** Checks if player won or not*/
    let checkResult: Function;
    /** Shows appropiate massage*/
    let showResult: Function;

    let now: number;
    let loader: number | undefined;
    let Board: HTMLCanvasElement;
    let messageBox: HTMLElement;
    /** generates A path from (0,0) to (x,TotalCells-1)*/
    let pathfinder: Function;
    let TotalCells = 25;
    /** Stors info of all 4 directions for each cell of maze  0:path is blocked;  1:path is free; 2:path is used by pather;*/
    let cellData: Array<Array<Array<number>>> = new Array(TotalCells);
    /** Stors number of lines that can be drawn for each cell of maze*/
    let cellDatalines: Array<Array<number>> = new Array(TotalCells);
    let width = 500 / 25;
    let playerpos = [0, 0];
    let destination:Array<number>=[]
    let moveUp:Function,moveDown:Function,moveLeft:Function,moveRight:Function
    let clearX: Function;
    let resetPlayerOnScreen: Function;
    // initialization
    for (let i = 0; i < TotalCells; i++) {
        cellData[i] = new Array(TotalCells);
        cellDatalines[i] = new Array(TotalCells);
    }

    /**
     *  Handles the running of the game
     */
    const Game = () => {
        if (gameStarted){ // play pause the game
            pauseGame()
        }else{
            gameStarted = true;
            showLoading();
            resetVariables();
            setTimeout(() => {
                pathfinder();
                initializePath();
                coverBoundary();
                closeLoading();
                paused = false;
                startTimer(); // This function calls the checkresult function  which calls showresult.
            }, 7);
        }7  };


    const pauseGame = () => {
        paused = !paused
        totalTime = now + 1
        if (paused){
            clearX()
            msg = "THE MAZE"
        }else{
            startTimer()
        }
    }

    pathfinder = () => {
        var c = Board.getContext("2d");
        var pather = [0, 0];
        var maxBackMove = 0; // maximum time this finder can move backwards
        var maxUpMove = 7; // maximum time this finder can move upwards
        if (c) {
            while (pather[1] != TotalCells - 1) {
                let direction = ((Math.random() * 10) | 0) % 4;
                c.beginPath();
                c.strokeStyle = "red";
                let row = pather[0],
                    column = pather[1];

                let moveToX: number = 0,
                    moveToY: number = 0,
                    newX: number = 0,
                    newY: number = 0;
                // Since running this function first so it may be that celldata[row][column] isn't initialized
                if (!cellData[row][column]) {
                    cellData[row][column] = new Array(4);
                    for (let k = 0; k < 4; k++) cellData[row][column][k] = 1;
                }
                switch (direction) {
                    case 0: // finder moves up
                        if (row > 0 && maxUpMove > 0) {
                            if (!cellData[row - 1][column]) {
                                cellData[row - 1][column] = new Array(4);
                                for (let k = 0; k < 4; k++)
                                    cellData[row - 1][column][k] = 1;
                            }
                            maxUpMove--;
                            cellData[row - 1][column][1] = 2;
                            cellData[row][column][0] = 2;
                            moveToX = width * column;
                            moveToY = width * row;
                            newX = width * column + width;
                            newY = width * row;
                            row--;
                        }
                        break;
                    case 1: // finder moves down
                        if (row + 1 < TotalCells) {
                            // same initialization
                            if (!cellData[row + 1][column]) {
                                cellData[row + 1][column] = new Array(4);
                                for (let k = 0; k < 4; k++)
                                    cellData[row + 1][column][k] = 1;
                            }
                            //setting that path is used by the pather
                            cellData[row + 1][column][0] = 2;
                            cellData[row][column][1] = 2;
                            moveToX = width * column;
                            moveToY = width * (row + 1);
                            newX = width * column + width;
                            newY = width * (row + 1);
                            row++;
                        }
                        break;
                    case 2: // finder moves left
                        if (column > 0 && maxBackMove > 0) {
                            maxBackMove--;
                            cellData[row][column - 1][3] = 2;
                            cellData[row][column][2] = 2;
                            moveToX = width * column;
                            moveToY = width * row;
                            newX = width * column;
                            newY = width * (row + 1);
                            column--;
                        }
                        break;
                    case 3: // finder moves right
                        if (column + 1 < TotalCells) {
                            if (!cellData[row][column + 1]) {
                                cellData[row][column + 1] = new Array(4);
                                for (let k = 0; k < 4; k++)
                                    cellData[row][column + 1][k] = 1;
                            }
                            cellData[row][column + 1][2] = 2;
                            cellData[row][column][3] = 2;
                            moveToX = width * (column + 1);
                            moveToY = width * row;
                            newX = width * column + width;
                            newY = width * (row + 1);
                            column++;
                        }
                        break;
                }
                c.moveTo(moveToX, moveToY);
                c.lineTo(newX, newY);
                c.stroke();
                pather = [row, column];
            }
            destination=pather
        }
    };

    initializePath = () => {
        Board.width = 500;
        Board.height = 500;
        width = 500 / 25;
        var c = Board.getContext("2d");

        for (let row = 0; row < TotalCells; row++) {
            // i represents row
            for (let column = 0; column < TotalCells; column++) {
                // j represents column

                let currentX = width * column,
                    currentY = width * row;

                let currentdata = new Array(4),
                    currentdatalines = 0;

                for (let k = 0; k < 4; k++) currentdata[k] = 1;
                if (cellData[row][column]) currentdata = cellData[row][column];
                if (cellDatalines[row][column])
                    currentdatalines = cellDatalines[row][column];
                let maxlines = 3 - currentdatalines; //maximum lines that can be drawn for this cell
                currentdata.forEach((element) => {
                    // calculating how many lines can still be drawn
                    if (element == 0) maxlines--;
                });
                if (c) {
                    c.strokeStyle = "white";
                    c.beginPath();

                    // This goes to all 4 sides of this cell and chooses randomly either to draw a barrier/line or not.-
                    for (let l = 0; l < 4; l++) {
                        if (currentdata[l] == 2) {
                            maxlines--;
                            continue;
                        }
                        if (maxlines <= 0) {
                            break;
                        }
                        if (currentdata[l] == 0) continue;
                        const todraw = ((Math.random() * 10) | 0) % 2; // whether to draw a line/barrier or not
                        if (todraw == 1) {
                            maxlines--;
                            switch (l) {
                                case 0: // Up wall
                                    if (row - 1 >= 0) {
                                        if (cellDatalines[row - 1][column] == 3)
                                            break;
                                        cellDatalines[row - 1][column]--;
                                        cellData[row - 1][column][1] = 0;
                                        c.moveTo(currentX, currentY);
                                        c.lineTo(currentX + width, currentY);
                                        currentdata[l] = 0; // path is blocked for direction l
                                    }
                                    break;
                                case 1: // Down Wall
                                    if (row != TotalCells - 1) {
                                        // initialization
                                        if (!cellData[row + 1][column]) {
                                            cellData[row + 1][column] =
                                                new Array(4);
                                            for (let k = 0; k < 4; k++)
                                                cellData[row + 1][column][k] =
                                                    1;
                                        }
                                        cellData[row + 1][column][0] = 0;
                                        cellDatalines[row + 1][column] = 1;
                                        c.moveTo(currentX, currentY + width);
                                        c.lineTo(
                                            currentX + width,
                                            currentY + width,
                                        );
                                        currentdata[l] = 0; // path is blocked for direction l
                                    }
                                    break;
                                case 2: // Left Wall
                                    if (column - 1 >= 0) {
                                        if (cellDatalines[row][column - 1] == 3)
                                            break;
                                        cellData[row][column - 1][3] = 0;
                                        cellDatalines[row][column - 1]--;
                                        c.moveTo(currentX, currentY);
                                        c.lineTo(currentX, currentY + width);
                                        currentdata[l] = 0; // path is blocked for direction l
                                    }
                                    break;
                                case 3: // Right Wall
                                    if (column != TotalCells - 1) {
                                        // initialization
                                        if (!cellData[row][column + 1]) {
                                            cellData[row][column + 1] =
                                                new Array(4);
                                            for (let k = 0; k < 4; k++)
                                                cellData[row][column + 1][k] =
                                                    1;
                                        }
                                        cellData[row][column + 1][2] = 0;
                                        cellDatalines[row][column + 1] = 1;
                                        c.moveTo(currentX + width, currentY);
                                        c.lineTo(
                                            currentX + width,
                                            currentY + width,
                                        );
                                        currentdata[l] = 0; // path is blocked for direction l
                                    }
                                    break;
                            }
                        }
                        c.stroke();
                    }
                    cellData[row][column] = currentdata; //updation
                }
                // console.log(row + "," + column);
                // console.log(cellData[row][column] + "");
                cellDatalines[row][column] = 3 - maxlines; // updation
            }
        }
    };

    /** This just makes line on the border */
    const coverBoundary = () => {
        var c = Board.getContext("2d");
        if (c)
            for (let i = 0; i < TotalCells; i++) {
                for (let j = 0; j < TotalCells; j++) {
                    c.beginPath();
                    c.strokeStyle = "white";
                    let currentX = width * j,
                        currentY = width * i;
                    if (i == 0) {
                        c.moveTo(currentX, currentY);
                        c.lineTo(currentX + width, currentY);
                        cellData[i][j][0] = 0;
                    } else if (i == TotalCells - 1) {
                        c.moveTo(currentX, currentY + width);
                        c.lineTo(currentX + width, currentY + width);
                        cellData[i][j][1] = 0;
                    }
                    if (j == 0) {
                        c.moveTo(currentX, currentY);
                        c.lineTo(currentX, currentY + width);
                        cellData[i][j][2] = 0;
                    } else if (j == TotalCells - 1) {
                        c.moveTo(currentX + width, currentY);
                        c.lineTo(currentX + width, currentY + width);
                        cellData[i][j][3] = 0;
                    }
                    c.stroke();
                }
            }
    };

    resetVariables = () => {
        sec = "45";
        color = "#04fc43";
        playerpos = [0, 0];
        resetPlayerOnScreen()
        clearX()
        totalTime = 45
        gameStarted = false;
        paused = false
        TotalCells = 25;
        cellData = new Array(TotalCells);
        cellDatalines = new Array(TotalCells);
        width = 500 / 25;
        for (let i = 0; i < TotalCells; i++) {
            cellData[i] = new Array(TotalCells);
            cellDatalines[i] = new Array(TotalCells);
        }
    };

    showLoading = () => {
        msg = "Loading";
        messageBox.innerHTML = msg;
        let count = ".";
        // console.log(msg);
        loader = setInterval(() => {
            count += ".";
            // console.log("p");
            if (count == "....") {
                count = ".";
            }
        }, 1000);
    };

    closeLoading = () => {
        clearInterval(loader);
        gameStarted = true;
    };

    checkResult = () => {
        if(playerpos[1]==destination[1] && playerpos[0] == destination[0])
        return true
        else
        return false
    }

    showResult = (msg:string) => {
        alert(`You ${msg}`)
    }

    onMount(() => {
        screenWidth = document.documentElement.clientWidth;
        const ss = document.getElementById("ss");
        const sec_dot = document.getElementById("sec_dot");
        let temp = document.querySelector("canvas");
        if (temp) Board = temp;
        let temp2 = document.getElementById("messageBox");
        if (temp2) messageBox = temp2;
        let player = document.getElementById("img");
        let train = document.getElementById("imgDest");
        let x: number;
        moveUp=()=>{
            if (player)
            if (playerpos[0] > 0) {
                            if (cellData[playerpos[0]][playerpos[1]][0] != 0) {
                                // console.log("HH");
                                playerpos[0]--;
                                player.style.transform = `translateX(${
                                    playerpos[1] * width
                                }px) translateY(${playerpos[0] * width}px)`;
                                checkResult()
                            } else {
                                console.log(
                                    cellData[playerpos[0]][playerpos[1]][0],
                                );
                            }
                        }
        }
        moveDown=()=>{
            if(player){
                if (playerpos[0] + 1 < TotalCells) {
                            if (cellData[playerpos[0]][playerpos[1]][1] != 0) {
                                // console.log("pp");
                                playerpos[0]++;
                                player.style.transform = `translateX(${
                                    playerpos[1] * width
                                }px) translateY(${playerpos[0] * width}px)`;
                                checkResult()
                            } else {
                                console.log(
                                    cellData[playerpos[0]][playerpos[1]][1],
                                );
                            }
                        }
            }
        }

        moveLeft=()=>{
            if(player){
                if (playerpos[1] > 0) {
                            // console.log("left");
                            if (cellData[playerpos[0]][playerpos[1]][2] != 0) {
                                // console.log("HH1");
                                playerpos[1]--;
                                player.style.transform = `translateX(${
                                    playerpos[1] * width
                                }px) translateY(${playerpos[0] * width}px)`;
                                checkResult()
                            } else {
                                console.log(
                                    cellData[playerpos[0]][playerpos[1]][2],
                                );
                            }
                        }
            }
        }
        moveRight=()=>{
            if(player){
                if (playerpos[1] + 1 < TotalCells) {
                            // console.log("left");
                            if (cellData[playerpos[0]][playerpos[1]][3] != 0) {
                                // console.log("pp1");
                                playerpos[1]++;
                                player.style.transform = `translateX(${
                                    playerpos[1] * width
                                }px) translateY(${playerpos[0] * width}px)`;
                            } else {
                                console.log(
                                    cellData[playerpos[0]][playerpos[1]][3],
                                );
                            }
                        }
            }
        }

        document.onkeydown = function (e) {
            // console.log(
            //     cellData[playerpos[0]][playerpos[1]] + "::" + playerpos,
            // );
            if (player && gameStarted &&  !paused) {
                switch (e.key) {
                    case "ArrowUp":
                        moveUp()
                        break;
                    case "ArrowDown":
                        moveDown()
                        break;
                    case "ArrowLeft":
                        moveLeft()
                        break;
                    case "ArrowRight":
                        moveRight()
                        break;
                }
            }
            if(checkResult()){
                showResult("WON")
                gameStarted = false
                paused = false
            }
        };
        clearX = () => {
            if (x) {
                clearInterval(x)
            }
        }

        resetPlayerOnScreen = () => {
            if (player) player.style.transform = 'none';
        }


        startTimer = () => {
            if(train)
            train.style.transform = `translateX(${
                                    destination[1] * width
                                }px) translateY(${destination[0] * width}px)`;
            clearX()
            let starting :Date = new Date()

            x = setInterval(() => {
                now =totalTime - ((Math.abs((new Date()).valueOf() - starting.valueOf())) / 1000) | 0
                // console.log(now)

                if (sec_dot)
                    sec_dot.style.transform = `rotateZ(${(now - 1) * 6}deg)`;
                if (ss)
                    ss.style.strokeDashoffset =
                        440 - (440 * (now - 1)) / 60 + "";

                // now -= 1;
                sec = now + "";
                if (now <= 10) {
                    color = "red";
                    if(player)
                    player.style.backgroundImage=`url("/src/assets/fear.jpg")`
                }

                if (now <= 0) {
                    clearX()
                    // console.log(destination+"<<>>"+playerpos)
                    let result = checkResult()
                    if (result == true){
                        showResult("WON")
                        resetVariables()
                    }else{
                        showResult("LOST")
                        resetVariables()
                    }
                    gameStarted = false
                }
            }, 1000);
        };
    });


</script>-

<main>
    <div class="textBox">
        <h1 class="heading fonter">The Maze</h1>
    </div>
    <div class="Main_Container">
        <div class="timerDiv">
            <div class="timer" style="--clr:{color}">
                <div class="dots sec_dot" id="sec_dot"></div>
                <svg>
                    <circle cx="70" cy="70" r="70"></circle>
                    <circle cx="70" cy="70" r="70" id="ss"></circle>
                </svg>
                <div id="seconds">{sec}<br /><span>seconds</span></div>
            </div>
            <div class="arrows">
                <button class="btn" style="grid-row: 1;grid-column:2;" on:click={()=>{moveUp()}}>W</button>
                <button class="btn" style="grid-row: 2;" on:click={()=>{moveLeft()}}>A</button>
                <button class="btn" style="grid-row: 2;" on:click={()=>{moveDown()}}>S</button>
                <button class="btn" style="grid-row: 2;" on:click={()=>{moveRight()}}>D</button>
            </div>

            <button class="play" on:click={Game}>{(gameStarted) ? ((paused) ? "PLAY" : "PAUSE") : "PLAY"}</button>
        </div>    
        <div class="{(screenWidth >900)?"halfwidth":""} playarea" 
            style={(paused) ? "filter: blur(8px);" : ""};    
        >
            <div id="img"></div>
            <div id="imgDest" ></div>
            <canvas
                class="boardcanvas playareacontnt"
                style={!gameStarted ? "display: none;" : ""}
                id="board" 
            >
            </canvas>
            <div
                class="playareacontnt"
                id="messageBox"
                style={gameStarted? "display: none;" : ""}
            >
                {msg}
            </div>
        </div>
    </div>
</main>

<style>
    * {
        transition: all 0.5s;
    }
    main {
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        background-image: url("/src/assets/img2.jpeg");
        background-attachment: fixed;
        background-size: cover;
        color: whitesmoke;
        font-family: "Poppins", times-new-roman, "Lucida Sans",
            "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode",
            Geneva, Verdana, sans-serif;
    }
    .timerDiv{
        display: flex;
        flex-direction: column;
        margin-top: auto;
        margin-right: 20px;
        width: 150px;
        height: 100%;
        justify-content: space-between;
        margin-bottom: auto;
    }
    .arrows{
        display: grid;
        grid-template-columns: auto auto auto;
        align-items: center;
        justify-content: center ;
        margin-top: 10px;
    }
    .timer {
        background: white;
        width: 150px;
        position: relative;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        align-items: center;
        justify-content: center;
        height: 150px;
        background: transparent;
    }
    .timer svg {
        position: relative;
        height: 150px;
        width: 150px;
        transform: rotate(270deg);
    }
    .timer svg circle {
        width: 100%;
        height: 100%;
        stroke-linecap: round;
        stroke-width: 8;
        fill: transparent;
        transform: translateX(5px) translateY(5px);
        stroke: black;
    }
    .timer div {
        text-align: center;
        position: absolute;
        font-weight: 900;
        color: #fff;
        font-size: 1.5em;
    }
    .timer div span {
        position: absolute;
        transform: translateX(-22px) translateY(-10px);
        font-size: 0.35em;
        font-weight: 300;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .timer svg circle:nth-child(2) {
        stroke: var(--clr);
        stroke-dasharray: 440;
    }
    .timer .dots {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1000;
    }
    .timer .dots::before {
        position: absolute;
        width: 15px;
        height: 15px;
        content: "";
        top: -3px;
        background: var(--clr);
        border-radius: 50%;
        box-shadow:
            0 0 20px var(--clr),
            0 0 20px var(--clr);
    }
    .play {
        margin: 0 20px;
        margin-top: 20px;
    }
    
    .halfwidth {
        width: 45%;
    }
    .playarea {
        display: flex;
        align-self: center;
        justify-content: center;
        margin-right: 3em;
    }
    .playarea div {
        display: flex;
        font-size: 3em;
        align-items: center;
        justify-content: center;
    }
    .boardcanvas {
        padding: 7px;
        display: flex;
        background-color: black;
        align-items: center;
        justify-content: center;
    }
    #imgDest{
        position: relative;
        z-index: 6;
        left: 28px;
        top: 10px;
        background-position: center;
        background-size: cover;
        min-width: 17px;
        height: 17px;
        background-image: url('/src/assets/train.jpg');
    }

    #img{
        left: 44px;
        top: 10px;
        background-image: url('/src/assets/smile.jpg');
        transition: all 0.5s;
        position: relative;
        background-position: center;
        background-size: cover;
        min-width: 17px;
        height: 17px;
        z-index: 5;
    }
    .playareacontnt {
        border-radius: 15px;
        width: 500px;
        backdrop-filter: blur(10px);
        height: 500px;
        background-color: transparent;
        border: 2px black solid;
        box-shadow: 0 0 60px whitesmoke;
    }
    .Main_Container {
        display: flex;
        justify-content: space-evenly;
    }
    .textBox {
        width: 100%;
        display: inline-block;
    }
    .fonter {
        font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
            sans-serif;
        font-style: italic;
        font-weight: bold;
    }
    .heading {
        font-size: 100px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 30px;
        top: 0;
        -webkit-text-fill-color: transparent;
        text-shadow:
            8px 8px #fff,
            15px 15px #494444;
    }
    @media (max-width: 900px) {
        main {
            width: 100vw;
            min-width: 0px;
            display: block;
            overflow-y: hidden;
            background-repeat: repeat-y;
        }
        * {
            font-size: smaller;
        }
        h1 {
            width: 50%;
        }
        .heading {
            font-size: 40px;
            margin: 0;
            display: flex;
            align-self: center;
        }
        .textBox {
            max-height: 80px;
            max-lines: 1;
            display: flex;
            justify-content: center;
        }
        .Main_Container{
            flex-direction: column;
            align-items: center;    
            display: flex;
            justify-content: center;
        }   
        .timerDiv{
            margin: 20px 0 ;
            width: 100%;
            flex-direction: row;
            display: flex;
            align-items: center;
        }
        .timer{
            scale: 0.5;
        }
        #seconds span{
            margin: 10px 5px;
            font-size: 7px;
        }
        .play{
            height: 40px;
            width: 100%;
            margin: 0 30px;
        }
        .arrows{
            height: 70px;
            margin: 0;
        }
        .btn{
            width: 30px;
            height: 30px;
            font-size: 10px;
        }
        .playarea{
            transform: scaleX(0.6) scaleY(0.6) translateY(-15%);
            margin: 0;
            padding: 0;
        }
    }
</style>
