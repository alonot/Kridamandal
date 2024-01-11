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
    }
    .Main_Container{
        width: 60%;
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .textBox{
        display: inline-block;
        justify-self: center;
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
</style>