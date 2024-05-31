<script lang="ts">
    import Homepage from './lib/Homepage.svelte';
    import TicTacToe from './lib/TicTacToe.svelte';
    import TheMaze from './lib/TheMaze.svelte';
    import About from './lib/About.svelte';
    import { onMount } from 'svelte';
    $: currentGame = 1

    let screenWidth:number

    onMount(()=>{
      screenWidth=document.documentElement.clientWidth | 0
    })

    let ids = ["home","currentGame"]
    window.onscrollend=(e)=>{
      if(document.documentElement.clientWidth > 600){
        let percent=document.documentElement.scrollLeft/document.documentElement.scrollWidth
        percent+=0.125

        let tomove=Math.floor(Number(percent*4))
        let id = ids[tomove]
        const element=document.getElementById(id)
        window.scrollTo({
          left:element?.offsetLeft,
          behavior:'smooth'
        })
      }else{
        //   let percent=document.documentElement.scrollTop/document.documentElement.scrollHeight
        // percent+=0.125

        // let tomove=Math.floor(Number(percent*4))
        // let id = ids[tomove]
        // const element=document.getElementById(id)
        // window.scrollTo({
        //   top:element?.offsetTop
        // })
      }
    }

    const backBtnPressed = () => {
      const element=document.getElementById("home")
      if (screenWidth >900){
        window.scrollTo({
          left:element?.offsetLeft,
          behavior:'smooth'
        })
      }else{
        window.scrollTo({
          top:element?.offsetTop,
          behavior:'smooth'
        })
      }
    }
  

</script>

<main>

  <div id="home" class="page">
    <Homepage bind:currentGame={currentGame}></Homepage>
  </div>
  <div id="currentGame" class="page">
    <div id="backBtn">
      <button on:click={backBtnPressed}>Back</button>
    </div>
    {#if currentGame == 1 }
      <TicTacToe ></TicTacToe>
    {:else if currentGame == 2}
      <TheMaze ></TheMaze>
    {:else}
      <About></About>
    {/if}
  </div>
</main>

<style>
  main{
    max-height: 100vh;
    height: 100vh;
    display: flex;
  }
  .page{
    height: 100vh;
  }
  #backBtn{
    margin: 20px;
    position: absolute;
    z-index: 2;
  }

  @media(max-width:900px){
    main{
      display: block;
      height: auto;
      transition: all 0.5s;
      width: 100vw;
      max-height: 200vh;
    }
  }
</style>
