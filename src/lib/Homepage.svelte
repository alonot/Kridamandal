<script lang="ts">

    function focus(){
        console.log("HH")
        document.getElementById('Home')?.focus()
    }

    export const focusHome=()=>{
        document.getElementById('Home')?.focus()
    }

</script>

<main id="Home">
    <div class="holder"></div>
    <div class="Main_Container">
        <div class="textBox">
            <h1>
                <span class="heading fonter">Kridamandal</span><br>
            </h1>
            <center>
            <span class="subHeading fonter">ॐ भूर्भुवः स्वः 
                तत्सवितुर्वरेण्यं
                भर्गो देवस्यः धीमहि
                धियो यो नः प्रचोदयात्</span>
            </center>   
        </div>
    </div>
</main>

<style>
    main{
        width: 100vw;
        min-width: 1070px;
        display: flex;
        height: 100%;
        background-image: url('/src/assets/Shivji.jpg');
        background-size: cover;
        background-attachment: fixed;
        background-repeat: repeat-x;
    }
    .holder{
        width: 40%;
        height: fit-content;
    }
    .Main_Container{
        width: 60%;
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
    }
    .heading{
        font-size: 100px;
        align-self: center;
        -webkit-text-fill-color: transparent;   
        text-shadow: 8px 8px #fff, 15px 15px #494444;
    }
    @media(max-width:1000px){
        main{
        width: 100vw;
        min-width: 0px;
        display: block;
        background-image: url('/src/assets/shivji_mobile.jpg');
        background-repeat: repeat-y;
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
</style>