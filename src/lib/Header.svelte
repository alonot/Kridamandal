<script lang="ts">

</script>



<style>
    
    .yellow{
        color:#f1d039;
    }
    .white{
        color: rgb(218, 225, 225);
    }
    .one{   
        grid-column-start: 1;
        grid-column-end: 1;
    }
    .two{   
        grid-column-start: 2;
        grid-column-end: 2;
    }
    .three{
        grid-column-start: 3;
        grid-column-end: 3;
    }
    .four{
        grid-column-start: 4;
        grid-column-end: 4;
    }
    .scrollholder{
        height: 10px;
        display: grid;
        grid-template-columns: auto auto auto auto;
        column-gap: 1.5em;
    }
    .scroller{
        background-color: rgb(241, 208, 57);
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    nav{
        position: fixed;
        padding: 0 5px;
        padding-bottom: 10px;
        width: fit-content;
        border: none;
        transition:all 500ms;
    }
    .itemHolder{
        display: grid;
        grid-template-columns: auto auto auto auto;
    }
    nav:hover{
        border-bottom-right-radius: 25px;
        background-color: #222323;
        border-bottom: 3px #222323 solid;
        border-right: 3px #222323 solid;
        
    }
    a::before{
        background-color: bisque;
        color: beige;
    }
    a{
        text-decoration: none;
        font-style: italic;
        justify-items: center;
        font-weight: 500;
        cursor: pointer;
        padding: 0 1.5em;
        font-family: 'Livvic', sans-serif ;
    }
</style>

<!-- 

<nav>
    <ul>
        <li>
            <center>
            <span class="selected" id="home" >Home
            </span>
            </center>
             <a class="{current=="one"?"yellow":"white"}" on:click={()=> current="one"}>Home</a> -->
        <!-- </li>
        <li>
            <span class="selected" id="tictactoe">TicTacToe</span>
        </li>
        <li>
            <span class="selected">TheMaze</span>
        </li>
        <li>
            <span class="selected">About</span>
        </li>
    </ul> --> 
    <!-- <div class="itemHolder">
        <a class="{current=="one"?"yellow":"white"}" on:click={()=> current="one"}>HOME</a>
        <a class="{current=="two"?"yellow":"white"}" on:click={()=> current="two"}>TicTacToe</a>
        <a class="{current=="three"?"yellow":"white"}" on:click={()=> current="three"}>The Maze</a>
        <a class="{current=="four"?"yellow":"white"}" on:click={()=> current="four"}>About</a>
    </div> -->
<!-- </nav>

<style>
    ul{
        display: flex;
        list-style-type: none;
    }
    #home::before{
        background-color: rgb(241, 208, 57);
        color: rgb(241, 208, 57);
        content: "Home";
        padding: 0 5px;
        position: fixed; 
        top: -10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

    }
    span{
        display: flex;
        justify-self: center;
    }
    li{
        margin-right:3em;
        place-content: center;
        display: grid;
    }
    li >span:hover{
        color: rgb(241, 208, 57);
        cursor: pointer;
    }
    nav:hover{
        border-bottom-right-radius: 25px;
        background-color: #222323;
        height: fit-content;
        border-bottom: 3px #222323 solid;
        border-right: 3px #222323 solid;
        
    }
    nav{
        position: fixed;
        padding: 0 5px;
        padding-bottom: 10px;
        width: fit-content;
        border: none;
        transition:all 500ms;
    }
    a{
        text-decoration: none;
        justify-items: center;
        font-weight: 500;
        padding: 0 1.5em;
    }
</style> -->