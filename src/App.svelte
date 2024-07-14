<script lang="ts">
    import Homepage from './lib/Homepage.svelte';
    import TicTacToe from './lib/TicTacToe.svelte';
    import TheMaze from './lib/TheMaze.svelte';
    import About from './lib/About.svelte';
    import { onDestroy, onMount, setContext } from 'svelte';
    import PopUpBox from './lib/Components/PopUpBox.svelte';
    import { ASK, DIALOG, GAMEMODE, LOADING } from './lib/Helpers/util';

    import Connect4 from './lib/Connect4.svelte';
    import { PopUp } from './lib/Helpers/PopUp';
    import { Room } from './lib/Helpers/room';
    import RoomCard from './lib/Components/RoomCard.svelte';
    import Loading from './lib/Components/Loading.svelte';

    //// States for this app //////////
    let currentGame = 1
    let gameMode:number = GAMEMODE.OFFLINE;
    let loading = false;
    let message = ""
    $: PopUpObj = new PopUp("","",false,[]) 
    $: room = new Room(handleMessage)
    // Room will be reinitialized on reload.
    ///////////////////////////////////

    onDestroy(()=>{
      room.clear()
    })

    function handleMessage(data:{}){
      console.log(data)
      // @ts-ignore
      const type = data.type
      if (type == undefined || null){
        return
      }
      switch(type){
        case "error":
          displayPopUp(
            "Error",
             // @ts-ignore
            data.message,
            3000,
            undefined
          )
          break;

        case "create_room":
          const pass = room.password
          const websocket = room.websocket
          room.resetRoomID()
          // @ts-ignore
          const data_room = data.data
          room.password = pass
          room.websocket = websocket
          room.room_id = data_room.room_id
          room.players = data_room.players
          for (var i= 0; i< room.players.length; i++){
            const p = room.players[i]
            if (p.name == data_room.device_player){

              room.device_player = p;
              break
            }
          }
          console.log(room.device_player)
          
          break;

        case "add_player":
          // @ts-ignore
          const player = data.data
          room.players.push(player)
          room.players = room.players
          break;

        case "remove_player":
          // @ts-ignore
          const p_data = data.data
          const player_name = p_data.name
          const admin_name = p_data.admin
          room.players = room.players.filter(player => {
            if (admin_name == player.name){
              player.admin = true
            }
            if (player.name != player_name){
              return player
            }
          });
          if (room.players.length == 0){
            room.clear()
          }
          room = room
          break;
            
        case "make_watcher":
          // @ts-ignore
          let name = data.data
          room.players.forEach(player => {
            if (player.name == name){
              player.role = "Watcher"
            }
          });  
          break;

        case "make_player":
          // @ts-ignore
          name = data.data
          room.players.forEach(player => {
            if (player.name == name){
              player.role = "Player"
            }
          });
          break;

          default: 
          break;

      }
      setLoading(false,"")
    }


    let screenWidth:number
    let startProgress:Function;
    onMount(()=>{
      screenWidth=document.documentElement.clientWidth | 0
      window.onbeforeunload = function(e){
        e.preventDefault()
        const return_str = "Are you sure? You will be logged out of the room."
        e.returnValue = return_str
        return return_str
      }
      window.addEventListener('unload', function() {
        console.log("ll")
        if (room.websocket) {
            room.websocket.close();
        }
      });
      setInterval(()=>{
        if ((gameMode == GAMEMODE.MULTIPLAYER) && (room.websocket == null || room.websocket.readyState != room.websocket.OPEN) ){
          room.clear()
          displayPopUp(
            "Error",
            "Disconnected",
            3000,
            undefined
          )
        }
        
      },60000)  // checks ever 1 minutes if connection is still on or not..
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
    const displayPopUp=(title:string,message:string,timeOutTime:number,afterMessage:Function | undefined)=>{ 
        
        PopUpObj.clear()
        PopUpObj.title = title
        PopUpObj.message = message
        PopUpObj.isOn = true
        PopUpObj.inputHints = []
        PopUpObj.totalTime = timeOutTime;
        if (afterMessage != undefined)
          PopUpObj.afterMessage = afterMessage
        else{
          PopUpObj.afterMessage = null
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
        
        PopUpObj.clear()
        PopUpObj.title = title
        PopUpObj.message = message
        PopUpObj.isOn = true
        PopUpObj.cancelOn = cancelOn
        PopUpObj.inputHints = input
        PopUpObj.totalTime = 0;
        PopUpObj.afterMessage = afterDialog
        return
    }


    function setLoading(val:boolean,msg:undefined | string){
      if (msg != undefined && val){
        message = msg
      }else{
        message = ""
      }
      loading = val
    }
    setContext(DIALOG,displayPopUp)
    setContext(ASK,askPopUp)
    setContext(LOADING,setLoading)

  

</script>

<main>
  {#if loading}
    <Loading message={message}/>
  {/if}
  {#if (PopUpObj.isOn)}
  <div class="popUpHolder">
    <PopUpBox bind:PopUpObj= {PopUpObj}/>
  </div>
  {/if}
  <section id="boss_section">
    <div id="home" class="page">
      <RoomCard bind:prop_room={room} />
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
