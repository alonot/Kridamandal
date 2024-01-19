<script lang="ts">
    import { onMount } from "svelte";


    $: sec="60"
    $: color="#04fc43"
    $: message="The Maze"
    $: gameStarted=false

    let end=60
    /**
     * Generates the Maze
     */
    let initializePath:Function
    /**
     * Resets the Variables used by the games
     */
    let resetVariables:Function
    /** Shows the loading bar while generating the maze */
    let showLoading:Function
    /** Starts the timer*/
    let startTimer:Function
    /** Hides the loading bar*/
    let closeLoading:Function
    /** Checks if player won or not*/
    let checkResult:Function
    /** Shows appropiate message*/
    let showResult:Function
    let now:number
    let loader: number | undefined
    let Board: HTMLCanvasElement
    let pathfinder:Function
    let TotalCells=25
    const cellData:Array<Array<Array<number>>>=new Array(TotalCells)
    const cellDatalines:Array<Array<number>>=new Array(TotalCells)
    const bestPath:Array<Array<number>>=[]
    let width=500/25;
    for(let i=0;i<TotalCells;i++){
        cellData[i]=new Array(TotalCells)
        cellDatalines[i]=new Array(TotalCells)
    }

    /**
     *  Handles the running of the game 
    */
    const Game=()=>{
        gameStarted=true
        // showLoading()
        resetVariables()
        // closeLoading()
        pathfinder()
        initializePath()
        coverBoundary()
        startTimer()  // This function calls the checkresult function  which calls showresult.

    }

    let temp=[0,0]
    pathfinder=()=>{
        var c = Board.getContext('2d')
        var pather=[0,0]
        var maxBackMove=0
        var maxUpMove=7
        if(c){
            while(pather[1] != TotalCells-1){
                let direction = (Math.random() *10 | 0) % 4
                c.beginPath()
                c.strokeStyle="red"
                let row=pather[0],column=pather[1]
                // console.log(row,column)
                let moveToX:number=0,moveToY:number=0,newX:number=0,newY:number=0
                if(!cellData[row][column]){
                    cellData[row][column]=new Array(4)
                    for(let k=0;k<4;k++) cellData[row][column][k]=1
                }
                switch(direction){
                    case 0:
                            if(row>0 &&  maxUpMove>0){
                                if(!cellData[row-1][column]){
                                    cellData[row-1][column]=new Array(4)
                                    for(let k=0;k<4;k++) cellData[row-1][column][k]=1
                                }
                                maxUpMove--
                                cellData[row-1][column][1]=2
                                cellData[row][column][0]=2
                                moveToX=width*column
                                moveToY=(width*(row))
                                newX=(width*column+width)
                                newY=(width*(row))
                                row--
                            }
                            break
                    case 1:
                            if(row+1 < TotalCells){
                                if(!cellData[row+1][column]){
                                    cellData[row+1][column]=new Array(4)
                                    for(let k=0;k<4;k++) cellData[row+1][column][k]=1
                                }
                                cellData[row+1][column][0]=2
                                cellData[row][column][1]=2
                                moveToX=width*column
                                moveToY=(width*(row+1))
                                newX=(width*column+width)
                                newY=(width*(row+1))
                                row++
                            }
                            break
                    case 2:
                            if(column>0 && maxBackMove>0){
                                maxBackMove--
                                cellData[row][column-1][3]=2
                                cellData[row][column][2]=2
                                moveToX=width*column
                                moveToY=(width*(row))
                                newX=(width*column)
                                newY=(width*(row+1))
                                column--
                            }
                            break
                    case 3:
                            if(column+1 < TotalCells){
                                if(!cellData[row][column+1]){
                                    cellData[row][column+1]=new Array(4)
                                    for(let k=0;k<4;k++) cellData[row][column+1][k]=1
                                }
                                cellData[row][column+1][2]=2
                                cellData[row][column][3]=2
                                moveToX=width*(column+1)
                                moveToY=(width*(row))
                                newX=(width*column+width)
                                newY=(width*(row+1))
                                column++
                            }
                            break
                }
                var present=false
                var temp=[row,column]
                // for(let y=0;y<bestPath.length;y++){
                //     if(bestPath[y][0]== temp[0] && bestPath[y][1]== temp[1] ){
                //         present=true
                //         break
                //     }
                // }
                if(!present){
                    c.moveTo(moveToX,moveToY)
                    c.lineTo(newX,newY)
                    c.stroke()
                    pather=temp
                    // bestPath.push(pather)
                }
            }
            console.log(pather)
            temp=pather
            cellData[pather[0]][pather[1]]=new Array(4)
            for(let k=0; k<4;k++) cellData[pather[0]][pather[1]][k]=1
            cellData[pather[0]][pather[1]][3]=2
        }
    }
    
    initializePath=()=>{
        Board.width=500
        Board.height=500

        var c = Board.getContext('2d')
        
        
        for(let row = 0 ;row<TotalCells; row++){ // i represents row
            for(let column=0 ;column<TotalCells;column++){ // j represents column

                let currentX=width*column,currentY=width*row

                let currentdata=new Array(4),currentdatalines=0
                
                for(let k=0;k<4;k++) currentdata[k]=1
                if (cellData[row][column]) currentdata=cellData[row][column]
                if (cellDatalines[row][column]) currentdatalines=cellDatalines[row][column]
                let maxlines=3-currentdatalines
                currentdata.forEach((element)=>{
                    if(!element) maxlines--
                })
                if(c){
                    c.strokeStyle = "white";
                    c.beginPath()
                    // const returned=handleBoundary(c,currentX,currentY,row,column,currentdata,maxlines)
                    // currentdata=returned.currentdata
                    // maxlines=returned.maxlines

                    for(let l=0;l<4;l++){
                        if(currentdata[l]==2){maxlines--; continue}
                        if(maxlines<=0){
                            break
                        }
                        if(!currentdata[l]) continue
                        const todraw=(Math.random() *10 | 0)%2
                        if(todraw == 1){
                            // console.log(row+","+column+':'+l)
                            maxlines-=1
                            switch(l){
                                case 0: // Up wall
                                        if(row-1 >= 0){
                                            if(cellDatalines[row-1][column] == 3) break
                                            cellDatalines[row-1][column]--
                                            cellData[row-1][column][1]=0
                                        }
                                        c.moveTo(currentX,currentY)
                                        c.lineTo(currentX+width,currentY)
                                        break;
                                case 1: // Down Wall
                                        if(row!=TotalCells-1){
                                            cellData[row+1][column]=new Array(4)
                                            for(let k=0;k<4;k++) cellData[row+1][column][k]=1
                                            cellData[row+1][column][0]=0
                                            cellDatalines[row+1][column]=1
                                        }
                                        c.moveTo(currentX,currentY+width)
                                        c.lineTo(currentX+width,currentY+width)
                                        break;
                                case 2: // Left Wall
                                        if(column-1 >= 0){
                                            if(cellDatalines[row][column-1] == 3) break
                                            cellData[row][column-1][3]=0
                                            cellDatalines[row][column-1]--
                                        }
                                        c.moveTo(currentX,currentY)
                                        c.lineTo(currentX,currentY+width)
                                        break;
                                case 3: // Right Wall
                                        if(column!=TotalCells-1){
                                            cellData[row][column+1]=new Array(4)
                                            for(let k=0;k<4;k++) cellData[row][column+1][k]=1
                                            cellData[row][column+1][2]=0
                                            cellDatalines[row][column+1]=1
                                        }
                                        c.moveTo(currentX+width,currentY)
                                        c.lineTo(currentX+width,currentY+width)
                                        break;
                            }
                            currentdata[l]=0
                        }
                        c.stroke()
                        
                    }
                    cellData[row][column]=currentdata
                    // console.log(row+","+column)
                    // console.log(cellData[row][column])
                }

                cellDatalines[row][column]=3-maxlines
            }
        }

        


    }

    const coverBoundary=()=>{
        var c=Board.getContext('2d')
        if(c)
        for(let i=0;i<TotalCells;i++){
            for(let j=0;j<TotalCells;j++){
                c.beginPath()
                c.strokeStyle="white"
                let currentX=width*j,currentY=width*i
                if(i==0){
                    c.moveTo(currentX,currentY)
                    c.lineTo(currentX+width,currentY)
                    cellData[i][j][0]=0
                }else if(i==TotalCells-1){
                    c.moveTo(currentX,currentY+width)
                    c.lineTo(currentX+width,currentY+width)
                    cellData[i][j][1]=0
                }
                if(j==0){
                    c.moveTo(currentX,currentY)
                    c.lineTo(currentX,currentY+width)
                    cellData[i][j][2]=0
                }else if(j==TotalCells-1){
                    c.moveTo(currentX+width,currentY)
                    c.lineTo(currentX+width,currentY+width)
                    cellData[i][j][3]=0
                }
                c.stroke()
            }
        }
    }

    resetVariables=()=>{
        sec="60"
        color="#04fc43"
        message="The Maze"
        gameStarted=false
    }

    showLoading=()=>{
        message="Loading"
        let count="."
        loader=setInterval(()=>{
            count+="."
            if(count == "...."){
                count = "."
            }
        },1000)
    }

    closeLoading=()=>{
        clearInterval(loader)
        gameStarted=true
    }

    onMount(()=>{
        const ss=document.getElementById('ss')
        const sec_dot=document.getElementById('sec_dot')
        let temp=document.querySelector('canvas')
        if (temp) Board=temp

        startTimer=()=>{

            let x=setInterval(()=>{
                now=parseInt(sec)
            
            if(sec_dot)
                sec_dot.style.transform = `rotateZ(${ now * 6}deg)`
            if(ss)
                ss.style.strokeDashoffset = 440 - (440 * now / 60)+""
            
            now-=1
            sec=now+""
            if(now == 10){
                color="red"
            }

            if (now ==0){
                clearInterval(x)
                let result = checkResult()
                if (result == true){
                    showResult("WON")
                }else{
                    showResult("LOST")
                }
            }
            },1000)
            
        }

    })

</script>

<main>
    <div class="textBox">
        <h1 class="heading fonter">The Maze</h1>
    </div>
    <div class="Main_Container">
        <div class="halfwidth cardholder">
            <div class="card">
                <h4>
                    "Embark on a thrilling journey through the twists and turns
                    of our Maze Game! Prepare to challenge your wits and
                    navigate the labyrinthine paths that await. This interactive
                    adventure promises excitement at every corner, testing your
                    problem-solving skills and providing a maze-ing fun
                    experience. Are you ready to unravel the mysteries within?
                    Step into the maze and let the excitement begin!<br /><br />
                    #MazeGame <br /> #AdventureAwaits"
                </h4>
                <button
                    class="play"
                    on:click={Game}>PLAY</button
                >
            </div>
        </div>
        <div class="timer" style="--clr:{color}">
            <div class="dots sec_dot" id="sec_dot"></div>
            <svg>
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70" id="ss"></circle>
            </svg>
            <div id="seconds">{sec}<br><span>seconds</span></div>
        </div>
        <div class="halfwidth playarea">
            <canvas class="boardcanvas playareacontnt" style="background-color: black;" id="board"> </canvas>
            <h3 class="playareacontnt" id="messageBox" style={!gameStarted?"display: none;":""}>{message}</h3>
        </div>
    </div>
</main>

<style>
    *{
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
        min-width: 1200px;
        color: whitesmoke;
        font-family: "Poppins", times-new-roman, "Lucida Sans",
            "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode",
            Geneva, Verdana, sans-serif;
    }
    .timer {
        background: white;
        width: 150px;
        position: relative;
        display: flex;
        margin-top: auto;
        left: -30px;
        margin-bottom: auto;
        align-items: center;
        justify-content: center;
        height: 150px;
        background: transparent;
    }
    .timer svg{
        position: relative;
        height: 150px;
        width: 150px;
        transform: rotate(270deg);
    }
    .timer svg circle{
        width: 100%;
        height: 100%;
        stroke-linecap: round;
        stroke-width: 8;
        fill: transparent;
        transform: translateX(5px) translateY(5px);
        stroke: black;

    }
    .timer div{
        text-align: center;
        position: absolute;
        font-weight: 900;
        color: #fff;
        font-size: 1.5em;
    }
    .timer div span{
        position: absolute;
        transform: translateX(-22px) translateY(-10px);
        font-size: 0.35em;
        font-weight: 300;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .timer svg circle:nth-child(2){
        stroke: var(--clr);
        stroke-dasharray: 440;
    }
    .timer .dots{
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1000;
    }
    .timer .dots::before{
        position: absolute;
        width: 15px;
        height: 15px;
        content: '';
        top: -3px;
        background: var(--clr);
        border-radius: 50%;
        box-shadow: 0 0 20px var(--clr),0 0 20px var(--clr);
    }
    .play {
        box-shadow: 0 0 20px white;
        float: right;
        border: white;
    }
    /* .fullwidth {
        width: 100%;
    } */
    .card {
        backdrop-filter: blur(10px);
        border: 3px black solid;
        width: 300px;
        height: 400px;
        line-break: auto;
        border-radius: 15px;
        transform-style: preserve-3d;
        margin: 3em auto;
        box-shadow: 0 0 60px red;
    }
    .cardholder {
        background: transparent;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -30px;
    }
    .halfwidth {
        width: 45%;
    }
    .playarea {
        display: flex;
        align-self: center;
    }
    .playarea h3{
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
    .playareacontnt{
        border-radius: 15px;
        width: 500px;
        backdrop-filter: blur(10px);
        height: 500px;
        background-color: transparent;
        border: 2px black solid;
        box-shadow: 0 0 120px whitesmoke;
    }
    .Main_Container {
        display: flex;
        justify-content: space-evenly;
    }
    .textBox {
        width: 100%;
        display: inline-block;
        margin-top: 2em;
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
        margin: auto;
        -webkit-text-fill-color: transparent;
        text-shadow:
            8px 8px #fff,
            15px 15px #494444;
    }
    @media (max-width: 1000px) {
        main {
            width: 100vw;
            min-width: 0px;
            display: block;
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
            align-self: center;
        }
    }
</style>
