<script lang="ts">

</script>

<main>
    <div class="textBox">
        <h1 class="heading fonter">About</h1>
    </div>
    <div class="Main_Container">
        <div class="fullWidth cardholder">
            <div class="card">
                <h3>Hello</h3>
                <h1>
                    I AM PRIYANSHU<br> PANDEY
                </h1>
                <h2> IIT PKD</h2>
            </div>
        </div>
    </div>
</main>

<style>
    main{
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        background-image: radial-gradient(gray,rgb(73, 73, 73),rgb(26, 24, 24),black 90%);
        background-attachment: fixed;
        background-size: cover;
        color: whitesmoke;
    }
    h3{
        margin-bottom: -2em;
    }
    h2{
        color: orange;
    }
    .fullWidth{
        width: 100%;
    }
    .cardholder h1{
        border-radius: 30%;
        /* box-shadow: 0 0 120px black; */
    }
    .Main_Container {
        display: flex;
        font-family: 'Courier New', Courier, monospace;
        font-size: 30px;
        color: rgb(178, 176, 174);
        text-align: center;
        justify-content: space-evenly;
    }
    .textBox {
        width: 100%;
        display: inline-block;
        margin-top: 2em;
        text-align: center;
    }
    .fonter{
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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
    @media(max-width:900px){
        main{
        width: 100vw;
        min-width: 0px;
        display: flex;
        flex-direction: column;
        background-repeat: repeat-y;
        }
        *{
            font-size: large;
        }
        h1{
            width: 100%;
            text-align: center;
        }
        .heading{
            font-size: 40px;
            margin: 0;
            display: flex;
            justify-content: center;
        }
        .textBox{
            max-height: none;
            display: flex;
            align-self: center;
        }
        h3{
            margin-bottom: 0;
        }
        .card{
            display: flex;
            flex-direction: column;
        }
        .Main_Container{
            margin: 20px 0;
        }
    }
</style>