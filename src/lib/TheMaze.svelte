<script lang="ts">

</script>

<main>
        <div class="Main_Container">
            <div class="textBox">
                <h1>
                    <span class="heading fonter">The Maze</span><br>
                </h1>   
            </div>
        </div>
</main>

<style>
    main{
        width: 100vw;
        display: flex;
        height: 100%;
        background-color: #161212;
        justify-content: center;
    }
    .Main_Container{    
        display: flex;
    }
    .textBox{
        display: inline-block;
    }
    .fonter{
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-style: italic;
        font-weight: bold;
    }
    .heading{
        font-size: 100px;
        -webkit-text-fill-color: transparent;   
        text-shadow: 8px 8px #fff, 15px 15px #494444;
    }
    @media(max-width:1000px){
        main{
        width: 100vw;
        min-width: 0px;
        display: block;
        background-repeat: repeat-y;
    }
    *{
        font-size: smaller;
    }
    h1{
        width: 50%;
    }
    .heading{
        font-size: 40px;
        margin: 0;
        display: flex;
        align-self: center;
    }
    .textBox{
        max-height: 80px;
        max-lines: 1;
        align-self: center;
    }
    }
</style>