<script lang="ts">
    import { onMount } from 'svelte';
    import GameCard from './Components/GameCard.svelte';
    import { GAMEMODE } from './Helpers/PopUp';

    let screenWidth:number
    export let currentGame = 1;
    export let currentMode:number;
    export let displayPopUp;

    const Allowed :{[key:string] : Array<number>}= {
      "Tic Tac Toe": [GAMEMODE.AI,GAMEMODE.OFFLINE],
      "Maze": [GAMEMODE.OFFLINE],
      "Connect 4":[],
      "Chess":[],
    }


    onMount(()=>{
    screenWidth=document.documentElement.clientWidth | 0

      const slider =<HTMLInputElement> document.getElementById("slider_bar")
      if(slider){
        slider.oninput = ()=> {
          if (slider.value)
            currentMode = Number.parseInt(slider.value);
        }
      }
    // console.log(screenWidth)
    })
    /**
     * Sets the current page...
    */
    const setCurrentGame = (val:string) => {
      switch (val) {
        case "Tic Tac Toe": currentGame = 1;break;
        case "Maze": currentGame = 2;break;
        case "Connect 4": currentGame = 3;break;
        case "Chess": currentGame = 4;break;
                default: currentGame = 999; // for about page
          break;
      }
    }

    export const focusHome=()=>{
        document.getElementById('Home')?.focus()
    }

    $: current = "one"
    /**
     * Updates the inner variable "current" which is used to set the game Screen
     * with appropiate game
    */
    const clicked=(str:string)=>{ 

      if ( str != "More Games Comming Soon" && ! (currentMode in Allowed[str]) ){
        // temporary condition until other modes are made
        displayPopUp(
          "Message",
          "Please wait we are trying out best to make this feature online as soon as possible.",
          5000
        )
        return;
      }
      console.log(currentMode)
      if (str !== "home"){
            setCurrentGame(str)
            handleclick()
        }
        current=str
    }
    

    /**
     * This scrolls the screen to the next window where game 
     * is ready to be played
     * @param event
     */
    function handleclick(){
      const element=document.getElementById("boss_section")
      const elementGame=document.getElementById("currentGame")
      // window.scrollTo({
      //   left:comp?.offsetLeft,
      //   behavior:'smooth'
      // })
      if(element != undefined && elementGame != undefined){
        
        elementGame.style.display= "flex";
          element.style.transform = "translateX(-100vw)"
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
            <input type="range" min="1" max="3" value={currentMode} id="slider_bar"/>
          </div>
          <div class="small_container">
            <GameCard name={"Tic Tac Toe"} color="#FFD600" onClick={clicked} />
            <GameCard name={"Maze"} color="#D50000" onClick={clicked}/>
            <GameCard name={"Connect 4"} color="#303F9F" onClick={clicked}/>
            <GameCard name={"Chess"} color="#8E24AA" onClick={clicked}/>
            <GameCard name={"More Games Comming Soon"} color="#C51162" onClick={clicked}/>
          </div>
          <div class="fullwidth infoDiv">
            {#if currentMode == 1}
              <p>Coming Soon</p>
            {:else if currentMode == 2}
              <p>Play all the games offline with your friends in the same device</p>
            {:else}
              <p>Comming Soon</p>
              <div class="multi-button">
                <button>Room</button>
                <button  style="--color:red"></button>
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
    .infoDiv{
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
        background-image: url('/src/assets/Shivji_img.jpg');
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
      }

      .textBox h1{
        text-align: center;
        max-height: 70px;
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

