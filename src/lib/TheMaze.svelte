<script lang="ts">
    import { onMount } from "svelte";


    $: sec="60"
    $: color="#04fc43"

    let end=60
    let updater:Function
    let now:number

    onMount(()=>{
        const ss=document.getElementById('ss')
        const sec_dot=document.getElementById('sec_dot')

        updater=()=>{

            let x=setInterval(()=>{
                now=parseInt(sec)
            
            if(ss)
                ss.style.strokeDashoffset = 440 - (440 * now / 60)+""
            if(sec_dot)
                sec_dot.style.transform = `rotateZ(${ now * 6}deg)`
            
            now-=1
            sec=now+""
            if(now == 10){
                color="red"
            }

            if (now ==0){
                clearInterval(x)
            }
            },1000)
            
        }

    })
    const reset=()=>{
            color="#04fc43"
            sec="60"
            updater()
        }

</script>

<main>
    <div class="textBox">
        <h1 class="heading fonter">The Maze</h1>
    </div>
    <div class="Main_Container">
        <div class="halfwidth cardholder">
            <div class="card">
                <h4>
                    "Embark on a thrilling journey through the twists and turns
                    of our Maze Game! Prepare to challenge your wits and
                    navigate the labyrinthine paths that await. This interactive
                    adventure promises excitement at every corner, testing your
                    problem-solving skills and providing a maze-ing fun
                    experience. Are you ready to unravel the mysteries within?
                    Step into the maze and let the excitement begin!<br /><br />
                    #MazeGame <br /> #AdventureAwaits"
                </h4>
                <button
                    class="reset"
                    on:click={reset}>PLAY</button
                >
            </div>
        </div>
        <div class="timer" style="--clr:{color}">
            <div class="dots sec_dot" id="sec_dot"></div>
            <svg>
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70" id="ss"></circle>
            </svg>
            <div id="seconds">{sec}<br><span>seconds</span></div>
        </div>
        <div class="halfwidth playarea">
            <canvas class="boardcanvas"> </canvas>
        </div>
    </div>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        background-image: url("/src/assets/img2.jpeg");
        background-attachment: fixed;
        background-size: cover;
        min-width: 1200px;
        color: whitesmoke;
        font-family: "Poppins", times-new-roman, "Lucida Sans",
            "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode",
            Geneva, Verdana, sans-serif;
    }
    .timer {
        background: white;
        width: 150px;
        position: relative;
        display: flex;
        margin-top: auto;
        left: -30px;
        margin-bottom: auto;
        align-items: center;
        justify-content: center;
        height: 150px;
        background: transparent;
    }
    .timer svg{
        position: relative;
        height: 150px;
        width: 150px;
        transform: rotate(270deg);
    }
    .timer svg circle{
        width: 100%;
        height: 100%;
        stroke-linecap: round;
        stroke-width: 8;
        fill: transparent;
        transform: translateX(5px) translateY(5px);
        stroke: black;

    }
    .timer div{
        text-align: center;
        position: absolute;
        font-weight: 900;
        color: #fff;
        font-size: 1.5em;
    }
    .timer div span{
        position: absolute;
        transform: translateX(-22px) translateY(-10px);
        font-size: 0.35em;
        font-weight: 300;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .timer svg circle:nth-child(2){
        stroke: var(--clr);
        stroke-dasharray: 440;
    }
    .timer .dots{
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1000;
    }
    .timer .dots::before{
        position: absolute;
        width: 15px;
        height: 15px;
        content: '';
        top: -3px;
        background: var(--clr);
        border-radius: 50%;
        box-shadow: 0 0 20px var(--clr),0 0 20px var(--clr);
    }
    .reset {
        box-shadow: 0 0 20px white;
        float: right;
    }
    .reset {
        border: white;
    }
    /* .fullwidth {
        width: 100%;
    } */
    .card {
        backdrop-filter: blur(10px);
        border: 3px black solid;
        width: 300px;
        height: 400px;
        line-break: auto;
        border-radius: 15px;
        transform-style: preserve-3d;
        margin: 3em auto;
        box-shadow: 0 0 60px red;
    }
    .cardholder {
        background: transparent;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
    }
    .halfwidth {
        width: 40%;
    }
    .playarea {
        display: flex;
        align-self: center;
    }
    .boardcanvas {
        border-radius: 15px;
        align-self: center;
        margin: 2em auto;
        width: 500px;
        backdrop-filter: blur(10px);
        height: 500px;
        background-color: transparent;
        border: 2px black solid;
        box-shadow: 0 0 120px whitesmoke;
    }
    .Main_Container {
        display: flex;
        justify-content: space-evenly;
    }
    .textBox {
        width: 100%;
        display: inline-block;
        margin-top: 2em;
    }
    .fonter {
        font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
            sans-serif;
        font-style: italic;
        font-weight: bold;
    }
    .heading {
        font-size: 100px;
        text-align: center;
        margin: auto;
        -webkit-text-fill-color: transparent;
        text-shadow:
            8px 8px #fff,
            15px 15px #494444;
    }
    @media (max-width: 1000px) {
        main {
            width: 100vw;
            min-width: 0px;
            display: block;
            background-repeat: repeat-y;
        }
        * {
            font-size: smaller;
        }
        h1 {
            width: 50%;
        }
        .heading {
            font-size: 40px;
            margin: 0;
            display: flex;
            align-self: center;
        }
        .textBox {
            max-height: 80px;
            max-lines: 1;
            align-self: center;
        }
    }
</style>
