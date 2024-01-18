<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let board:HTMLDivElement
    onMount(()=>{
        boardvalues=[[0,0,0],[0,0,0],[0,0,0]]
        document.onmousemove=(e)=>{
            if (!isplaying){
            // board.style.transform=`rotateX(0deg) rotateY(360deg)`
            //  console.log(e) 
             const dim=(board.getBoundingClientRect())
            //  console.log(dim)
             if (dim.left < e.screenX && dim.right> e.screenX && dim.top < e.screenY && dim.bottom > e.screenY) {
                let posX=e.screenX-dim.left;
                let posY=e.screenY-dim.top;
                let percenX=Number(posX/dim.width*60)
                let percenY=Number(posY/dim.height*60)
                // console.log(`${percenX} : ${percenY}`)
                percenX=(percenX<30)?percenX:percenX-60
                percenY=(percenY>30)?percenY:percenY-60
                // console.log(`${percenX} : ${percenY}`)
                board.style.transform=`rotateX(${percenX}deg) rotateY(${percenY}deg)`
             }else{
                board.style.transform=`rotateX(-30deg) rotateY(30deg)`
            }
            }
        }
    })

    let xplaces:Array<number>=[]
    let yplaces:Array<number>=[]
    let boardvalues=[[0,0,0],[0,0,0],[0,0,0]]
    let currentplayer=1
    $: isplaying=false
    $: player1=0
    $: gotwinner=false
    $: player2=0
    $: div=["","","","","","","","",""]

    function checkKar(prevpos:Array<number>,currentpos:Array<number>,nextpos:Array<number>){
        let hasSameValue=(boardvalues[prevpos[0]][prevpos[1]]==boardvalues[currentpos[0]][currentpos[1]] && boardvalues[nextpos[0]][nextpos[1]]==boardvalues[currentpos[0]][currentpos[1]])
        let slope1=(Math.abs(currentpos[1]-prevpos[1]) == Math.abs(nextpos[1] - currentpos[1])) && (Math.abs(currentpos[0]-prevpos[0]) == Math.abs(nextpos[0] - currentpos[0]))
        let slope2=(Math.abs(nextpos[1]-prevpos[1]) == Math.abs(prevpos[1] - currentpos[1])) && (Math.abs(nextpos[0]-prevpos[0]) == Math.abs(prevpos[0] - currentpos[0]))
        let slope3=(Math.abs(currentpos[1]-nextpos[1]) == Math.abs(nextpos[1] - prevpos[1])) && (Math.abs(currentpos[0]-nextpos[0]) == Math.abs(nextpos[0] - prevpos[0]))
        
        let is2SlopesEqual=slope1 || slope2 ||slope3
        return hasSameValue && is2SlopesEqual
    }


    function handleclick(index:number){
        if (div[index] == ""){
            div[index]=currentplayer==0?'X':'O'
            currentplayer=(currentplayer+1)%2
            let currentpos=[(index/3) | 0,index%3]
            boardvalues[currentpos[0]][currentpos[1]]=currentplayer==0?1:2
            if(currentplayer==0) xplaces.push(index) 
            else yplaces.push(index)
            
            const lst=currentplayer==0?xplaces:yplaces
            // console.log(xplaces)
            // console.log(yplaces)
            if ((xplaces).length+(yplaces).length==9){
                        board.style.pointerEvents="none"
                        board.style.filter="blur(5px)"
                        setTimeout(() => {
                            div=["","","","","","","","",""]
                            board.style.pointerEvents="auto"
                            boardvalues=[[0,0,0],[0,0,0],[0,0,0]]
                            xplaces=[];yplaces=[]
                            gotwinner=false
                            board.style.filter="blur(0px)"
                        }, 2000);
                    }

            
            lst.forEach(pos => {
                let prevpos,nextpos
                if(pos==index || gotwinner) return
                if(pos<index){  
                    prevpos=[pos/3 | 0,pos%3]
                    let slope=[(currentpos[0]-prevpos[0]),(currentpos[1]-prevpos[1])]
                    // console.log("sl:"+slope)

                    if(slope[0]>1 || slope[1] >1) return
                    nextpos=[currentpos[0]+slope[0],currentpos[1]+slope[1]]
                    nextpos=[nextpos[0]%3,nextpos[1]%3]
                    // console.log(nextpos)
                    // console.log(currentpos)
                    if(nextpos[0]<0 || nextpos[1]<0){
                        // if(slope[0]==1 && slope[0]==1) return
                        nextpos=[nextpos[0]<0?nextpos[0]+3:nextpos[0],nextpos[1]<0?nextpos[1]+3:nextpos[1]]
                    }
                }else{
                    nextpos=[pos/3 | 0,pos%3]
                    let slope=[(nextpos[0]-currentpos[0]),(nextpos[1]-currentpos[1])]
                    // console.log("s2:"+slope)
                    if(slope[0]>1 || slope[1] >1) return
                    prevpos=[currentpos[0]-slope[0],currentpos[1]-slope[1]]
                    prevpos=[prevpos[0]%3,prevpos[1]%3]
                    // console.log(prevpos)
                    if(prevpos[0]<0 || prevpos[1]<0){
                        // if(slope[0]==1 && slope[0]==1) return
                        prevpos=[prevpos[0]<0?prevpos[0]+3:prevpos[0],prevpos[1]<0?prevpos[1]+3:prevpos[1]]
                    }
                }   
                // console.log(prevpos+"\t:"+currentpos+":\t:"+nextpos) 
                if(checkKar(prevpos,currentpos,nextpos)){
                    let winner=boardvalues[currentpos[0]][currentpos[1]]
                    console.log("winner "+winner)
                    if(winner==2){
                        player1+=1
                    }else if(winner==1){
                        player2+=1
                    }
                    if(winner!=0){
                        board.style.pointerEvents="none"
                        board.style.filter="blur(5px)"
                        gotwinner=true
                        setTimeout(() => {
                            div=["","","","","","","","",""]
                            board.style.pointerEvents="auto"
                            boardvalues=[[0,0,0],[0,0,0],[0,0,0]]
                            xplaces=[];yplaces=[]
                            gotwinner=false
                            board.style.filter="none"
                        }, 2000);
                    }
                }
            });


        }
    }
    const play=() => {
        isplaying=true

    }
    const reset=() => {
        isplaying=false
        player1=0
        player2=0
        div=["","","","","","","","",""]
        board.style.pointerEvents="auto"
        boardvalues=[[0,0,0],[0,0,0],[0,0,0]]
        xplaces=yplaces=[]
        gotwinner=false
        board.style.filter="blur(0px)"
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
            <div class="reset" on:click={reset} style="background-color: green; transform: rotateY({isplaying?'0deg':'90deg'}); {gotwinner?"pointer-events:none":""}"></div>
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
        background-image: url('/src/assets/tictactoe.jpeg');
        background-size: cover;
        min-width: 1120px;
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
        width: auto;
        max-lines: 1;
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
        top: 90px;
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
    @media(max-width:1000px){
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