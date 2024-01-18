<script lang="ts">
    import Homepage from './lib/Homepage.svelte';
    import TicTacToe from './lib/TicTacToe.svelte';
    import TheMaze from './lib/TheMaze.svelte';
    import About from './lib/About.svelte';
    import { onMount } from 'svelte';

    let screenWidth:number

    onMount(()=>{
      screenWidth=document.documentElement.clientWidth | 0
    })

    $: current = "one"
    const clicked=(str:string)=>{
        current=str
    }

    function handleclick(event){
      console.log("pp")
      event.preventDefault()
      const link= event.currentTarget
      const href=link?.href
      if(href){
        const id= new URL(href).hash.replace('#','')
        const comp=document.getElementById(id)
        current=id
        window.scrollTo({
          left:comp?.offsetLeft,
          behavior:'smooth'
        })
      }
    }

    const ids=["home","tictac","maze","about"]
    window.onscrollend=(e)=>{
      if(document.documentElement.clientWidth > 600){
        let percent=document.documentElement.scrollLeft/document.documentElement.scrollWidth
        percent+=0.125

        let tomove=Math.floor(Number(percent*4))
        current=ids[tomove]
        const element=document.getElementById(ids[tomove])
        window.scrollTo({
          left:element?.offsetLeft,
          behavior:'smooth'
        })
      }else{
          let percent=document.documentElement.scrollTop/document.documentElement.scrollHeight
        percent+=0.125

        let tomove=Math.floor(Number(percent*4))
        current=ids[tomove]
        const element=document.getElementById(ids[tomove])
        window.scrollTo({
          top:element?.offsetTop
        })
      }
      console.log(current)
    }


</script>

<main>

  <div id="header">
    {#if screenWidth>600}
      <nav>
        <div class="scrollholder">
            <span class="scroller {current}"></span>
        </div>
        <div class="itemHolder">
            <a href="#home" on:click={handleclick} class="{current=="home"?"yellow":"white"}" on:click={()=>{clicked("home")}}>Home</a>
            <a href="#tictac" on:click={handleclick} class="{current=="tictac"?"yellow":"white"}" on:click={()=>{clicked("tictac")}}>TicTacToe</a>
            <a href="#maze" on:click={handleclick} class="{current=="maze"?"yellow":"white"}" on:click={()=>{clicked("maze")}}>The Maze</a>
            <a href="#about" on:click={handleclick} class="{current=="about"?"yellow":"white"}" on:click={()=>{clicked("about")}}>About</a>
        </div>
      </nav>
      {:else}
      <nav>
        <div class="itemHolder">
            <a href="#home" on:click={handleclick} class="{current=="home"?"yellow":"white"}" on:click={()=>{clicked("home")}}>Home</a>
            <a href="#tictac" on:click={handleclick} class="{current=="tictac"?"yellow":"white"}" on:click={()=>{clicked("tictac")}}>TicTacToe</a>
            <a href="#maze" on:click={handleclick} class="{current=="maze"?"yellow":"white"}" on:click={()=>{clicked("maze")}}>The Maze</a>
            <a href="#about" on:click={handleclick} class="{current=="about"?"yellow":"white"}" on:click={()=>{clicked("about")}}>About</a>
        </div>
      </nav> 
    {/if}
  </div>
  <div id="home" class="page">
    <Homepage ></Homepage>
  </div>
  <div id="tictac" class="page">
    <TicTacToe ></TicTacToe>
  </div>
  <div id="maze" class="page">
    <TheMaze ></TheMaze>
  </div>
  <div id="about" class="page">
    <About></About>
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

  @media(max-width:1000px){
    main{
      display: block;
      height: auto;
      width: 100vw;
      max-height: 400vh;
    }
  }
</style>
