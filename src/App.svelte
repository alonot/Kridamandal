<script lang="ts">
    import Homepage from './lib/Homepage.svelte';
    import TicTacToe from './lib/TicTacToe.svelte';
    import TheMaze from './lib/TheMaze.svelte';
    import About from './lib/About.svelte';
    import { onMount, setContext } from 'svelte';
    import PopUpBox from './lib/Components/PopUpBox.svelte';
    import { ASK, DIALOG, GAMEMODE, LOADING } from './lib/Helpers/util';

    import Connect4 from './lib/Connect4.svelte';
    import { PopUp } from './lib/Helpers/PopUp';
    import { Room } from './lib/Helpers/room';
    import RoomCard from './lib/Components/RoomCard.svelte';
    import Loading from './lib/Components/Loading.svelte';

    let currentGame = 1
    let gameMode = GAMEMODE.OFFLINE;
    let loading = false;
    $: PopUpObj = new PopUp("","",false,[]) 
    $: room = new Room() // new logic needed that does remove this on reload.

    let screenWidth:number
    let startProgress:Function;
    onMount(()=>{
      screenWidth=document.documentElement.clientWidth | 0
      // reading room_key if present in sessionStorage
      const roomInfo = sessionStorage.getItem('room')
      if (roomInfo != null){
        const info = JSON.parse(roomInfo);
        room.roomId = info.room_id
        room.password = info.password
      }

      // const websocket = new WebSocket("ws://localhost:8001/");
      // websocket.onopen = (event) => {
      //   const socket = event.target as WebSocket
      //   socket!.send(JSON.stringify({game:1,move:"Info specific to game"}));}
    })

    let ids = ["home","currentGame"]
    window.onscrollend=(e)=>{
      if(document.documentElement.clientWidth > 900){
        let percent=document.documentElement.scrollLeft/document.documentElement.scrollWidth
        percent+=0.125

        let tomove=Math.floor(Number(percent*4))
        let id = ids[tomove]
        const element=document.getElementById(id)
        window.scrollTo({
          left:element?.offsetLeft,
          behavior:'smooth'
        })
      }
    }

    

    const backBtnPressed = () => {
      const element=document.getElementById("boss_section")
      const elementGame=document.getElementById("currentGame")
      if (screenWidth >900){
        // window.scrollTo({
        //   left:element?.offsetLeft,
        //   behavior:'smooth'
        // })
        if(element != undefined && elementGame != undefined){
          element.style.transform = "translateX(0)"
          setTimeout(()=>{
            elementGame.style.display= "none";
          },850)
        }

      }else{
        if(element != undefined && elementGame != undefined){
          element.style.transform = "translateY(0)"
          setTimeout(()=>{
            elementGame.style.display= "none";
          },850)
        }
      }
    }

    /**
     * display a popUp Box
     * @param title
     * @param message
     * @param timeOutTime
     */
    const displayPopUp=(title:string,message:string,timeOutTime:number)=>{ 
        // temporary condition until other modes are made
        PopUpObj.title = title
        PopUpObj.message = message
        PopUpObj.isOn = true
        PopUpObj.inputHints = []
        PopUpObj.totalTime = timeOutTime;
        PopUpObj.afterMessage = null
        if (timeOutTime != 0){
          PopUpObj.interval = setTimeout(()=> {
            PopUpObj.isOn = false
          }, timeOutTime) // extra time for function to return
        }
        return
    }

     /**
     * display a popUp Box
     * @param title
     * @param message
     * @param timeOutTime
     */
     const askPopUp=(title:string,message:string,input:string[],cancelOn:boolean,afterDialog:Function)=>{ 
        // temporary condition until other modes are made
        PopUpObj.title = title
        PopUpObj.message = message
        PopUpObj.isOn = true
        PopUpObj.cancelOn = cancelOn
        PopUpObj.inputHints = input
        PopUpObj.totalTime = 0;
        PopUpObj.afterMessage = afterDialog
        return
    }


    function setLoading(val:boolean){
      loading = val
    }
    setContext(DIALOG,displayPopUp)
    setContext(ASK,askPopUp)
    setContext(LOADING,setLoading)

  

</script>

<main>
  {#if loading}
    <Loading/>
  {/if}
  {#if (PopUpObj.isOn)}
  <div class="popUpHolder">
    <PopUpBox bind:PopUpObj= {PopUpObj}/>
  </div>
  {/if}
  <section id="boss_section">
    <div id="home" class="page">
      <RoomCard bind:room={room} />
      <Homepage bind:currentGame={currentGame} bind:currentMode={gameMode} bind:room={room}></Homepage>
    </div>
    <div id="currentGame" class="page">
      <div id="backBtn">
        <button on:click={backBtnPressed}>Back</button>
      </div>
      {#if currentGame == 1 }
        <TicTacToe bind:gameMode={gameMode} ></TicTacToe>
      {:else if currentGame == 2}
        <TheMaze ></TheMaze>
      {:else if currentGame == 3}
        <Connect4 bind:gameMode={gameMode}/>
      {:else}
        <About></About>
      {/if}
    </div>
  </section>
</main>

<style>
  #currentGame{
    display: none;
  }
  section{
    width: 100%;
    display: flex;
    transition: all 0.8s ease-in-out;
  }
  main{
    max-height: 100vh;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }
  .page{
    height: 100vh;
  }
  #backBtn{
    margin: 20px;
    position: absolute;
    z-index: 2;
  }

  .popUpHolder{
    position: absolute;
    z-index: 400;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6161614a;
    transition: all 0.5s ease;
  }
  @media(max-width:900px){
    section{
      display: block;
    }
    main{
      display: block;
      height: auto;
      transition: all 0.5s;
      width: 100vw;
      max-height: 100vh;
    }
  }
</style>
