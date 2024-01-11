<script lang="ts">
    import Homepage from './lib/Homepage.svelte';
    import TicTacToe from './lib/TicTacToe.svelte';
    import TheMaze from './lib/TheMaze.svelte';
    import About from './lib/About.svelte';

    $: current = "one"
    const clicked=(str:string)=>{
        current=str
    }

    function handleclick(event){
      console.log("pp")
      event.preventDefault()
      const link= event.currentTarget
      const id= new URL(link.href).hash.replace('#','')
      const comp=document.getElementById(id)
      window.scrollTo({
        left:comp?.offsetLeft,
        behavior:'smooth'
      })
    }


</script>

<main>

  <div id="header">
    <!-- <Header bind:component={components}></Header> -->
    <nav>
      <div class="scrollholder">
          <span class="scroller {current}"></span>
      </div>
      <div class="itemHolder">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-missing-attribute --> 
          <a href="#home" on:click={handleclick} class="{current=="one"?"yellow":"white"}" on:click={()=>{clicked("one")}}>Home</a>
          <a href="#tictac" on:click={handleclick} class="{current=="two"?"yellow":"white"}" on:click={()=>{clicked("two")}}>TicTacToe</a>
          <a href="#maze" on:click={handleclick} class="{current=="three"?"yellow":"white"}" on:click={()=>{clicked("three")}}>The Maze</a>
          <a href="#about" on:click={handleclick} class="{current=="four"?"yellow":"white"}" on:click={()=>{clicked("four")}}>About</a>
      </div>
    </nav>
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
</style>
