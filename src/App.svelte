<script lang="ts">
    import Homepage from './lib/Homepage.svelte';
    import TicTacToe from './lib/TicTacToe.svelte';
    import TheMaze from './lib/TheMaze.svelte';
    import About from './lib/About.svelte';
    import { onMount } from 'svelte';
    import PopUpBox from './lib/Components/PopUpBox.svelte';
    import PopUp, { GAMEMODE } from './lib/Helpers/PopUp';

    $: currentGame = 1
    $: gameMode = GAMEMODE.OFFLINE;
    $: PopUpObj = new PopUp("","",false,[]) 

    let screenWidth:number

    onMount(()=>{
      screenWidth=document.documentElement.clientWidth | 0
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
        window.scrollTo({
          top:element?.offsetTop,
          behavior:'smooth'
        })
      }
    }

    /**
     * Displays a PopUp
    */
    const displayPopUp=(title:string,message:string,timeOutTime:number)=>{ 
        // temporary condition until other modes are made
        PopUpObj.title = title
        PopUpObj.message = message
        PopUpObj.isOn = true
        PopUpObj.inputHints = []
        if (timeOutTime != 0){
          setTimeout(()=> {
            PopUpObj.isOn = false
          }, timeOutTime)
        }
        return
    }
  

</script>

<main>

  {#if (PopUpObj.isOn)}
  <div class="popUpHolder">
    <PopUpBox bind:PopUpObj= {PopUpObj}/>
  </div>
  {/if}
  <section id="boss_section">
    <div id="home" class="page">
      <Homepage bind:currentGame={currentGame} bind:currentMode={gameMode} displayPopUp= {displayPopUp}></Homepage>
    </div>
    <div id="currentGame" class="page">
      <div id="backBtn">
        <button on:click={backBtnPressed}>Back</button>
      </div>
      {#if currentGame == 1 }
        <TicTacToe bind:gameMode={gameMode} displayPopUp= {displayPopUp}></TicTacToe>
      {:else if currentGame == 2}
        <TheMaze ></TheMaze>
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
      max-height: 200vh;
    }
  }
</style>
