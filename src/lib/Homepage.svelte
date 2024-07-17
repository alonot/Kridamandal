<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import GameCard from '$lib/Components/GameCard.svelte';
    import { ASK, DIALOG, GAMEMODE, GETPLAYERS, LOADING, SCROLL, SETGAME } from '$lib/Helpers/util';
    import type { Room } from '$lib/Helpers/room';

    let screenWidth:number
    let sliderBar:HTMLInputElement
    export let currentMode:number;
    const displayPopUp:Function = getContext(DIALOG);
    const loading:Function = getContext(LOADING);
    const askPopUp:Function = getContext(ASK);
    const getPlayers:Function = getContext(GETPLAYERS);
    const handleclick:Function = getContext(SCROLL);
    const setCurrentGame:Function = getContext(SETGAME);
    export let room:Room;

    const Allowed :{[key:string] : Array<number>}= {
      "Tic Tac Toe": [GAMEMODE.AI,GAMEMODE.OFFLINE, GAMEMODE.MULTIPLAYER],
      "Maze": [GAMEMODE.OFFLINE,],
      "Connect 4":[GAMEMODE.OFFLINE,GAMEMODE.AI,GAMEMODE.MULTIPLAYER],
      "Infinite Tic Tac":[GAMEMODE.OFFLINE,GAMEMODE.AI,GAMEMODE.MULTIPLAYER],
    }

    function showRoom(){
      room.show = true;
    }

    function gotPlayers(result:any[]){
      if(result[0]){

        loading(true,"Waiting for the other player to be ready....")
        if (!room.startGame(result[1])){
          displayPopUp(
            "Error",
            "Unknown senario encountered. No game was set.",
            2000
          )
          loading(false,"")
        }

      }else{
        return
      }
    }

    async function ensureConnection(str:string){
      if (room.device_player != null && room.websocket && room.websocket.readyState == room.websocket.OPEN){
        if (room.device_player.admin){
          room.game = str
          getPlayers(gotPlayers)
          
        }else{
          displayPopUp(
            "Alert",
            "You Cannot start a game. Please ask admin to start the game.",
            3000
          )
        }
      }else{
        displayPopUp(
          "Alert",
          "Please (re)create/(re)join a room first",
          3000,
          ()=>{showRoom()}
        )
      }
    }

    function revertSlider(){
      if (sliderBar){
        sliderBar.value = "2"
      }
      currentMode = 2
      setTimeout(()=>{
        displayPopUp(
          "Error",
          "Unable to connect to the server",
          3000,
          ()=>{loading(false,"")}
        )
      },100)
    }


    onMount(()=>{
      screenWidth=document.documentElement.clientWidth | 0

      if(sliderBar){
        sliderBar.oninput = async (e)=> {
          if (sliderBar.value){
            // show loading
            loading(true,"")
            if (currentMode == GAMEMODE.MULTIPLAYER){
              const clearRoom = (result: any)=>{
                if (result[0]){
                  // clear the room
                  room.clear();
                }else{
                  sliderBar.value = "3";
                  currentMode = GAMEMODE.MULTIPLAYER
                  loading(false)
                  return;
                }
                //
              }

              // add dialog
              askPopUp(
                "Error",
                "Do you want to leave the room?",
                [],
                true,
                clearRoom
              )
              
            }
            currentMode = Number.parseInt(sliderBar.value);
            if (currentMode == GAMEMODE.MULTIPLAYER){
              room.clear()
              loading(true,"Connecting to the server")
              if (await room.connectRooms()){
                loading(false)
              }else{
                revertSlider()
              }
            }else{
              //close loading
              loading(false)
            }
          }
        }
      }
    // console.log(screenWidth)
    })
    
    /**
     * Updates the inner variable "current" which is used to set the game Screen
     * with appropiate game
    */
    const clicked=async (str:string)=>{ 
      if ( str != "More Games Comming Soon" && !(Allowed[str].includes(currentMode)) ){
        // temporary condition until other modes are made
        displayPopUp(
          "Message",
          "Sorry We do not provide the selected service for this game.",
          5000
        )
        return;
      }
      if (currentMode == GAMEMODE.MULTIPLAYER){
        await ensureConnection(str)
      }else{
        if (str !== "home"){
              setCurrentGame(str)
              handleclick()
          }
      }
    }

    function showRoomClicked(){
      if (currentMode == GAMEMODE.MULTIPLAYER){
        showRoom()
      }
    }
    

</script>

<main id="Home">

    <div class="flexi fullwidth mobile" >
        <div class="Main_Container">
          <div class="image_holder">
              <div id="bg_image">

              </div>
          </div>
          <div class="textBox">
              <h1>
                  <span class="heading fonter">Kridamandal</span><br>
              </h1>
              <center>
              <span class="subHeading fonter">
                  ॐ भूर्भुवः स्वः
                  तत्सवितुर्वरेण्यं
                  भर्गो देवस्यः धीमहि
                  धियो यो नः प्रचोदयात्
              </span>
              </center>   
          </div>
      </div>
        <div class="Games_Container">
          <div class="sliderHolder">
            <div class="slider">
              <p>AI</p>
              <p>Offline</p>
              <p>Multi</p>
            </div>
            <input type="range" min="1" max="3" value={currentMode} id="slider_bar" bind:this={sliderBar}/>
          </div>
          <div class="small_container">
            <GameCard name={"Tic Tac Toe"} color="#FFD600" onClick={clicked} />
            <GameCard name={"Infinite Tic Tac"} color="#8E24AA" onClick={clicked}/>
            <GameCard name={"Connect 4"} color="#303F9F" onClick={clicked}/>
            <GameCard name={"Maze"} color="#D50000" onClick={clicked}/>
            <GameCard name={"More Games Comming Soon"} color="#C51162" onClick={clicked}/>
          </div>
          <div class="fullwidth infoDiv">
            {#if currentMode == 1}
              <p>Play against an AI, who is eagerly waiting to defeat its future slaves :) </p>
            {:else if currentMode == 2}
              <p>Play all the games offline with your friends on the same device</p>
            {:else}
              <p>Sit back, relax and challeng your friend online.</p>
              <div class="multi-button">
                <button on:click={showRoomClicked}>Room</button>
                <button  style="--color:{ room.room_id == 0 ? "red":"green"}"></button>
              </div>
            {/if}
          </div>
          
        </div>
    </div>
</main>

<style>
    main{
        width: 100vw;
        display: flex;
        height: 100%;
        background: black;
        background-attachment: fixed;
        background-repeat: repeat-x;
    }
    p{
      margin: 0;
    }
    .infoDiv{
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .infoDiv p{
      text-align: center;
      text-overflow: ellipsis;
      text-wrap: wrap;
      padding: 0 20%;
    }
    #bg_image{
        
        min-height: 100%;
        min-width: 100%;
    }
    .image_holder{
        background-image: url('$lib/assets/Shivji_img.jpg');
        background-size: contain;
        background-repeat: no-repeat;
        flex-direction: column;
        background-position: center;
        min-width: 320px;
        min-height: 326px;
    }
    .Main_Container{
      min-width: 50%;
      min-height: 100%;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .multi-button button:nth-child(2){
      max-width: 25px;
      max-height: 25px;
      background-color: var(--color);
      margin: 0 20px;
    }
    
    .multi-button{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .Games_Container{
        min-width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .small_container{
      display: grid;
      grid-row: auto;
      columns: 2;
      grid-template-columns: auto auto auto;
    }

    .sliderHolder{
      width: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      margin: 20px 0;
    }

    .sliderHolder input{
      width: 70%;
      border-radius: 20px;
    }

    .slider{
      width: 100%;
      display: grid;
      grid-auto-columns: minmax(0,1fr);
      grid-auto-flow: column;
    }
    .slider p{
      text-align: center;
      margin: 0;
    }

    .sliderHolder input[type='range']::-webkit-slider-runnable-track{
      background-color: #494444;
      border-radius: 10px;
    }


    .textBox{
        display: inline-block;
        align-self: center;
    }
    .fonter{
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-style: italic;
        font-weight: bold;
        text-overflow: ellipsis;
        word-wrap: break-word;
    }

    
    .heading{
        font-size: 70px;
        align-self: center;
        
        display: flex;
        justify-content: center;
        -webkit-text-fill-color: transparent;   
        text-shadow: 8px 8px #fff, 15px 15px #494444;
    }

    .textBox h1{
        height: 100px;
        margin: 3px 0;
    }

    @media (max-width:900px){
      .Main_Container{
        min-height: 0;
        margin-bottom: 20px;
      }
      .mobile{
        flex-direction: column;
      }

      #bg_image{
        
        min-height: none;
        max-height: 50%;
        max-width: 200px;
      }
      .image_holder{
        height: 20%; 
        min-height: 200px;
        min-width: 200px; 
        background-position: 30px;
        max-width: 350px;
        position: relative;
        top: 10px;
      }

      .textBox h1{
        text-align: center;
        max-height: 70px;
      }

      .subHeading{
        font-size: 13px;
      }
      .heading{
        font-size: smaller;
      }

      .Main_Container{
        flex-direction: column;
        min-width: 100vw;
        max-height: 50vh;
        margin: 5px 0;
      }
    }

    
</style>

