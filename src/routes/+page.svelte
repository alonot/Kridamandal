<script lang="ts">
    import Homepage from "$lib/Homepage.svelte";
    import TicTacToe from "$lib/TicTacToe.svelte";
    import TheMaze from "$lib/TheMaze.svelte";
    import About from "$lib/About.svelte";
    import { onDestroy, onMount, setContext } from "svelte";
    import PopUpBox from "$lib/Components/PopUpBox.svelte";
    import {
      ASK,
      DIALOG,
      GAMEMODE,
      GETPLAYERS,
      LOADING,
      MULTITYPES,
      SCROLL,
      SETGAME,
    } from "$lib/Helpers/util";
  
    import Connect4 from "$lib/Connect4.svelte";
    import { PopUp } from "$lib/Helpers/PopUp";
    import { Room } from "$lib/Helpers/room";
    import RoomCard from "$lib/Components/RoomCard.svelte";
    import Loading from "$lib/Components/Loading.svelte";
    import AskPlayer from "$lib/Components/AskPlayer.svelte";
  
    //// States for this app //////////
    let currentGame = 1;
    let gameMode: number = GAMEMODE.OFFLINE;
    let loading = false;
    let message = "";
    let askPlayers = false;
    let returnTo: Function | undefined;
    $: PopUpObj = new PopUp("", "", false, []);
    $: room = new Room(handleMessage);
  
    // Functions for Muliplayer //
    let handleMulti: ((arg0: { [key: string]: any; }) => void);
    // Room will be reinitialized on reload.
    ///////////////////////////////////
  
    onDestroy(() => {
      room.clear();
    });
  
    
    
    /**
     * This scrolls the screen to the next window where game
     * is ready to be played
     * @param event
     */
    function handleclick() {
      const element = document.getElementById("boss_section");
      const elementGame = document.getElementById("currentGame");
      // window.scrollTo({
      //   left:comp?.offsetLeft,
      //   behavior:'smooth'
      // })
      if (element != undefined && elementGame != undefined) {
        elementGame.style.display = "flex";
        if (screenWidth > 900) element.style.transform = "translateX(-100vw)";
        else element.style.transform = "translateY(-100vh)";
      }
    }
  
    /**
     * Sets the current page...
     */
    const setCurrentGame = (val: string) => {
      switch (val) {
        case "Tic Tac Toe":
          currentGame = 1;
          break;
        case "Maze":
          currentGame = 2;
          break;
        case "Connect 4":
          currentGame = 3;
          break;
        case "Chess":
          currentGame = 4;
          break;
        default:
          currentGame = 999; // for about page
          break;
      }
    };
  
    function readyResponse(result: any[]) {
     
      if (result[0]) {
        room.sendReadySignal();
      } else {
        room.sendNotReadyResponse();
      }
    }
  
    function setLoading(val: boolean, msg: undefined | string) {
      // console.log("load:" + val)
      if (msg != undefined && val) {
        message = msg;
      } else {
        message = "";
      }
      loading = val;
    }
  
    function getPlayers(retTo: Function) {
      askPlayers = true;
      returnTo = retTo;
    }
  
    /**
     * display a popUp Box
     * @param title
     * @param message
     * @param timeOutTime
     */
    const displayPopUp = (
      title: string,
      message: string,
      timeOutTime: number,
      afterMessage: Function | undefined,
    ) => {
      PopUpObj.clear();
      PopUpObj.title = title;
      PopUpObj.message = message;
      PopUpObj.isOn = true;
      PopUpObj.inputHints = [];
      PopUpObj.totalTime = timeOutTime;
      if (afterMessage != undefined) PopUpObj.afterMessage = afterMessage;
      else {
        PopUpObj.afterMessage = null;
      }
      return;
    };
  
    /**
     * display a popUp Box
     * @param title
     * @param message
     * @param timeOutTime
     */
    const askPopUp = (
      title: string,
      message: string,
      input: string[],
      cancelOn: boolean,
      afterDialog: Function,
    ) => {
      PopUpObj.clear();
      PopUpObj.title = title;
      PopUpObj.message = message;
      PopUpObj.isOn = true;
      PopUpObj.cancelOn = cancelOn;
      PopUpObj.inputHints = input;
      PopUpObj.totalTime = 0;
      PopUpObj.afterMessage = afterDialog;
      return;
    };
  
    let screenWidth: number;
    let startProgress: Function;
    onMount(() => {
      screenWidth = document.documentElement.clientWidth | 0;
      window.onbeforeunload = function (e) {
        if (gameMode == GAMEMODE.MULTIPLAYER){
          e.preventDefault();
          const return_str = "Are you sure? You will be logged out of the room.";
          e.returnValue = return_str;
          return return_str;
        }
      };

      let ids = ["home", "currentGame"];
    window.onscrollend = (e) => {
      if (document.documentElement.clientWidth > 900) {
        let percent =
          document.documentElement.scrollLeft /
          document.documentElement.scrollWidth;
        percent += 0.125;
  
        let tomove = Math.floor(Number(percent * 4));
        let id = ids[tomove];
        const element = document.getElementById(id);
        window.scrollTo({
          left: element?.offsetLeft,
          behavior: "smooth",
        });
      }
    };


      setInterval(() => {
        if (
          gameMode == GAMEMODE.MULTIPLAYER &&
          (room.websocket == null ||
            room.websocket.readyState != room.websocket.OPEN)
        ) {
          // console.log(room)
          room.clear();
          displayPopUp("Error", "Disconnected", 3000, undefined);
        }
      }, 60000); // checks ever 1 minutes if connection is still on or not..
    });
  
    
  
    /**
     * Bring focus back to the home page, In other words closes the current Game
     */
    function focusHome(){
      const element = document.getElementById("boss_section");
      const elementGame = document.getElementById("currentGame");
      if (screenWidth > 900) {
        // window.scrollTo({
        //   left:element?.offsetLeft,
        //   behavior:'smooth'
        // })
        if (element != undefined && elementGame != undefined) {
          element.style.transform = "translateX(0)";
          setTimeout(() => {
            elementGame.style.display = "none";
          }, 850);
        }
      } else {
        if (element != undefined && elementGame != undefined) {
          element.style.transform = "translateY(0)";
          setTimeout(() => {
            elementGame.style.display = "none";
          }, 850);
        }
      }
    }
  
    const backBtnPressed = () => {
      if (gameMode == GAMEMODE.MULTIPLAYER){
        askPopUp(
          "Alert",
          "Do you want to close the game?",
          [],
          true,
          (res:any[])=>{
            if (res[0]){
              room.cancelGame()
              focusHome()
            }
          }
        )
      }else{
        focusHome()
      }
      
    };
  
    function handleMessage(data: { [key: string]: any }) {
      // console.log(data);
      const type = data.type;
      if (type == undefined || type == null) {
        return;
      }
      switch (type) {
        case "error":
          displayPopUp("Error", data.message, 3000, undefined);
          break;
        case "loading":
          PopUpObj.clear();
          setLoading(true, data.message);
          break;
  
        case "create_room":
          const pass = room.password;
          const websocket = room.websocket;
          room.resetRoomID();
          const data_room = data.data;
          room.password = pass;
          room.websocket = websocket;
          room.room_id = data_room.room_id;
          room.players = data_room.players;
          for (var i = 0; i < room.players.length; i++) {
            const p = room.players[i];
            if (p.name == data_room.device_player) {
              room.device_player = p;
              break;
            }
          }
          // console.log(room.device_player);
  
          break;
  
        case "add_player":
          const player = data.data;
          room.players.push(player);
          room.players = room.players;
          break;
  
        case "remove_player":
          const p_data = data.data;
          const player_name = p_data.name;
          const admin_name = p_data.admin;
          room.players = room.players.filter((player) => {
            if (admin_name == player.name) {
              player.admin = true;
            }
            if (player.name != player_name) {
              return player;
            }
          });
          if (room.players.length == 0) {
            room.clear();
          }
          room = room;
          break;
        
        case "role_update":
          const roles = data.roles
          room.players.forEach((p)=>{
            const  role = roles[p.name]
            if (role != undefined){
              p.role = role
            }
          })
          setLoading(true,"Waiting for other player(s) to get ready.")
          break
  
        case "cancel":
          focusHome();
          setTimeout(function () {
            displayPopUp("Message", data.message, 3000, undefined);
          }, 800);
          break;
  
        case "ready":
          askPopUp(
            "Game",
            `Admin have sent a request to join the game: ${data.data}`,
            [],
            true,
            readyResponse,
          );
          break
        case "won":
          const won_info = data.data;
          const players = won_info["all_players"];
          room.players = players;
          for (var i = 0; i < room.players.length; i++) {
            const p = room.players[i];
            if (p.name == room.device_player?.name) {
              room.device_player = p;
              break;
            }
          }
          break
  
        case "create_board":
          const game_info = data.data;
          room.game = game_info['game'];
          setCurrentGame(room.game);
          handleclick();
          break
      }
      
      if (MULTITYPES.includes(type)) {
        if (type == "create_board"){
          // give some time to transform and create the game.
          setTimeout(()=>{
            handleMulti(data);
          },500) 
        }else{
          handleMulti(data);
        }
      }else if (type != "role_update" && type != "loading"){
        setLoading(false, "");
      }
      
    }
  
    setContext(DIALOG, displayPopUp);
    setContext(ASK, askPopUp);
    setContext(LOADING, setLoading);
    setContext(GETPLAYERS, getPlayers);
    setContext(SCROLL, handleclick);
    setContext(SETGAME, setCurrentGame);
  </script>
  
  <main>
    {#if loading}
      <Loading {message} />
    {/if}
    {#if PopUpObj.isOn}
      <div class="popUpHolder">
        <PopUpBox bind:PopUpObj />
      </div>
    {/if}
    {#if askPlayers}
      <div class="popUpHolder">
        <AskPlayer
          players={room.players}
          closeThis={() => {
            askPlayers = false;
          }}
          afterMessage={returnTo}
          device_player={room.device_player?.name ?? ""}
        />
      </div>
    {/if}
    <section id="boss_section">
      <div id="home" class="page">
        <RoomCard bind:prop_room={room} />
        <Homepage bind:currentMode={gameMode} bind:room></Homepage>
      </div>
      <div id="currentGame" class="page">
        <div id="backBtn">
          <button on:click={backBtnPressed}>Back</button>
          {#if gameMode == GAMEMODE.MULTIPLAYER}
            <button class="role_info" disabled>ROLE: {room.device_player?.role}</button>
          {/if}
        </div>
        {#if currentGame == 1}
          <TicTacToe bind:handleMultiplayer={handleMulti} bind:gameMode room={room} />
        {:else if currentGame == 2}
          <TheMaze />
        {:else if currentGame == 3}
          <Connect4 bind:handleMultiplayer={handleMulti} bind:device_player={room.device_player} room={room} bind:gameMode />
        {:else}
          <About></About>
        {/if}
      </div>
    </section>
  </main>
  
  <style>
    #currentGame {
      display: none;
    }
    section {
      width: 100%;
      display: flex;
      transition: all 0.8s ease-in-out;
    }
    main {
      max-height: 100vh;
      height: 100vh;
      display: flex;
      overflow: hidden;
    }
    .page {
      height: 100vh;
    }
    #backBtn {
      margin: 20px;
      position: absolute;
      z-index: 16;
      display: flex;
      gap: 10px;
    }
    .role_info:disabled{
      color: white;
    }
    .role_info{
      width: 160px;
      border: #b91b1b4a solid;
      box-shadow: 0 0 10px rgb(198, 91, 91);
    }
  
    .popUpHolder {
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
    @media (max-width: 900px) {
      section {
        display: block;
      }
      main {
        display: block;
        height: auto;
        transition: all 0.5s;
        width: 100vw;
        max-height: 100vh;
      }
    }
  </style>
  