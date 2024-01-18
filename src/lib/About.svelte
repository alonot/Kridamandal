<script lang="ts">

</script>

<main>
        <div class="Main_Container">
            <div class="textBox">
                <h1>
                    <span class="heading fonter">About</span><br>
                </h1>   
            </div>
        </div>
</main>

<style>
    main{
        width: 100vw;
        display: flex;
        height: 100%;
        background-color: #1e1e1d;
        justify-content: center;
    }
    .Main_Container{    
        display: flex;
        height: 100%;
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
        text-shadow: 8px 8px #fff, 20px 20px #494444;
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