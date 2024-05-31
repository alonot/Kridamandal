<script lang="ts">
    import { onMount } from 'svelte';

    let screenWidth:number
    export let currentGame = 1;

    onMount(()=>{
    screenWidth=document.documentElement.clientWidth | 0
    // console.log(screenWidth)
    })
    /**
     * Sets the current page...
    */
    const setCurrentGame = (val:string) => {
      switch (val) {
        case "one": currentGame = 1;break;
        case "two": currentGame = 2;break;
        case "three": currentGame = 3;break;
                default: currentGame = 999; // for about page
          break;
      }
    }

    export const focusHome=()=>{
        document.getElementById('Home')?.focus()
    }

    $: current = "one"
    $: hidden=true
    /**
     * Updates the inner variable "current" which is used to set the game Screen
     * with appropiate game
    */
    const clicked=(str:string)=>{ 
        if (str !== "home"){
            setCurrentGame(str)
        }
        current=str
    }
    
    function openMenu(event: {preventDefault: () => void;currentTarget: any;}){
      event.preventDefault()
      const navBar = document.getElementById("itemHolder_id")
      const messageBtn = document.getElementById("menuBtn")
      if (messageBtn?.innerHTML == "Menu"){
        if (messageBtn){
          messageBtn.innerHTML = "Cross"
          messageBtn.style.left = "200px"
        }
        if (navBar){
          navBar.style.left = "0";
          navBar.style.backgroundColor= "#222323";
          navBar.style.borderBottom=  '3px #222323 solid';
          navBar.style.borderRight= '3px #222323 solid';
        }
        
      }else{
        if (messageBtn){
          messageBtn.innerHTML = "Menu"
          messageBtn.style.left = "0"
        }
        if (navBar){
          navBar.style.left = "-110%";
          navBar.style.backgroundColor= "none";
          navBar.style.border=  'none';
        }
      }

    }

    /**
     * This scrolls the screen to the next window where game 
     * is ready to be played
     * @param event
     */
    function handleclick(event: { preventDefault: () => void; currentTarget: any; }){
    //   console.log("pp")
      event.preventDefault()
      const link= event.currentTarget
      const href=link?.href
      if(href){
        const id= new URL(href).hash.replace('#','')
        const comp=document.getElementById(id)
        window.scrollTo({
          left:comp?.offsetLeft,
          behavior:'smooth'
        })
      }
    }

</script>

<main id="Home">
    <div id="header">
        {#if screenWidth>900}
          <nav>
            <div class="itemHolder">
                <!-- <a href="#home" on:click={handleclick} class="{current=="home"?"yellow":"white"}" on:click={()=>{clicked("home")}}>Home</a> -->
                <a href="#currentGame" on:click={handleclick} class="{current=="one"?"yellow":"white"}" on:click={()=>{clicked("one")}}><h5>TicTacToe</h5></a>
                <a href="#currentGame" on:click={handleclick} class="{current=="two"?"yellow":"white"}" on:click={()=>{clicked("two")}}><h5>Maze</h5></a>
                <a href="#currentGame" on:click={handleclick} class="{current=="about"?"yellow":"white"}" on:click={()=>{clicked("about")}}><h5>About</h5></a>
            </div>
          </nav>
          {:else}
          <nav>
            <button id="menuBtn" on:click={openMenu}>Menu</button>
            <div class="itemHolder" id="itemHolder_id" style="display: flex;left:-110%;">
                <!-- <a href="#home" on:click={handleclick} class="{current=="home"?"yellow":"white"}" on:click={()=>{clicked("home")}}>Home</a> -->
                <a href="#currentGame" on:click={handleclick} class="{current=="one"?"yellow":"white"}" on:click={()=>{clicked("one")}}>TicTacToe</a>
                <a href="#currentGame" on:click={handleclick} class="{current=="two"?"yellow":"white"}" on:click={()=>{clicked("two")}}>The Maze</a>
                <a href="#currentGame" on:click={handleclick} class="{current=="about"?"yellow":"white"}" on:click={()=>{clicked("about")}}>About</a>
            </div>
          </nav> 
        {/if}
      </div>
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
    #bg_image{
        
        min-height: 100%;
        min-width: 100%;
    }
    .image_holder{
        background-image: url('/src/assets/Shivji_img.jpg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: -30px;
        min-width: 320px;
        min-height: 326px;
        min-height: 100%;
    }
    .Main_Container{
        width: 100%;
        min-width: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
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
        font-size: 100px;
        align-self: center;
        -webkit-text-fill-color: transparent;   
        text-shadow: 8px 8px #fff, 15px 15px #494444;
    }

    #header{
        position: absolute;
        height: fit-content;
    }
    nav{
      display: flex;
      margin-top: 0.1em;
    }

    @media (max-width:900px){
      main {
        display: flex;
        width: 100vw;
      }
      #menuBtn{
        height: 40px;
        width: 100px;
      }

      #bg_image{
        
        min-height: none;
        max-height: 50%;
        min-width: 100%;
      }
      .image_holder{
        min-height: 326px;
        background-position: 30px;
        max-width: 350px;
      }
      .itemHolder{
        flex-direction: column;
      }

      .textBox h1{
        text-align: center;
      }

      .heading{
        font-size: smaller;
      }

      .Main_Container{
        flex-direction: column;
        min-width: 100vw;
        margin-top: 50px;
      }
      nav{
        flex-direction: column;
        background-color: transparent;
        border: none;
      }
    }

    
</style>


<!-- 

@media(max-width:1000px){
  main{
  width: 100vw;
  min-width: 0px;
  display: block;
  /* background-image: url('/src/assets/shivji_mobile.jpg');
  background-repeat: repeat-y; */
  display: flex;
  background-position: 50%;
  justify-content: space-between;
  flex-direction: column;
}
.Main_Container{
  width: 100%;
  margin-bottom: 10%;
  align-self: baseline;
}
.heading{
  display: flex;
  justify-content: center;
  font-size: 50px;
}
.textBox{
  margin-top: 50px;
}
*{
  font-size: medium;
}
}

@media(max-width:1000px){
main{
display: block;
height: auto;
transition: all 0.5s;
width: 100vw;
max-height: 400vh;
}
.itemHolder{    
margin-top: 2em;
position: relative;
height: 100vh;
background: transparent;
flex-direction: column;
}
.itemHolder::before{
background-color: black;
position: absolute;
content: '';
z-index: -1;
opacity: 0.4;
}
.itemHolder a{
padding: 2em;
}
} -->