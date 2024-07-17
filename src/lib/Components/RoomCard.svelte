<script lang="ts">
    import type { Room } from "$lib/Helpers/room";
    import eyeClose from "$lib/assets/eye-closed.svg"
    import eyeOpen from "$lib/assets/eye-open.svg"
    import cross from "$lib/assets/cross.svg"
    import Player from "$lib/Components/Player.svelte";
    import { ASK, COLORS, DIALOG, LOADING, shuffle } from "$lib/Helpers/util";
    import { getContext, onMount } from "svelte";

    export let prop_room: Room;
    $: room = prop_room;
    let roomarea:HTMLElement;
    let mainarea:HTMLElement;
    const dialogPopUp:Function = getContext(DIALOG)
    const askPopUp:Function = getContext(ASK)
    const loading:Function = getContext(LOADING)
    onMount(()=>{
        mainarea.onclick=(e)=>{
            const bounds = roomarea.getBoundingClientRect()
            if (e.clientX > bounds.right || e.clientX < bounds.left || e.clientY > bounds.bottom || e.clientY < bounds.top  ){
                room.show = false;
            }
        }
    })

    function joinRoom(){
        // ask the nickname and password
        const afterDialog = (result:any[]) => {
            if (result[0]){
                const room_id = Number(result[1])
                if (Number.isNaN(room_id)) {
                    alert("Please provide a numeric room_id")
                    return
                }
                // send to join the room
                loading(true,"joining room")
                if (!room.join(room_id,result[2],result[3])){
                    loading(false)
                    // console.log("failde")
                    alert("Failed. Please retry")
                    room.connectRooms()
                }
            }
        }
        askPopUp(
            "Enter Room",
            "Please provide the details",
            ["roomID","Password","Nickname"],
            true,
            afterDialog
        )
    }

    function createRoom(){
        // ask the nickname and password
        const afterDialog =  (result:any[]) => {
            if (result[0]){
                loading(true,"creating room")
                if (!(room.create(result[1],result[2]))){
                    loading(false)
                    room.clear()
                    alert("Failed. Please retry")
                    room.connectRooms()
                }
            }
        }
        askPopUp(
            "Enter Room",
            "Please provide the details",
            ["Password","Nickname"],
            true,
            afterDialog
        )
    }

    function leaveRoom(){
        const afterDialog = function(result:any[]){
            if (result[0]){
                room.show = false
                room.clear()
            }
        }
        askPopUp(
            "Alert",
            "Do you want to leave the room.",
            [],
            true,
            afterDialog
        )

    }

    shuffle(COLORS)
    

    let showPassword = false;

</script>

<main bind:this={mainarea} style="transform: translateY({room.show ? "0vh" : "-100vh"});">
    <section bind:this={roomarea} class="roomarea">
        <div class="heading flexi">
            <h3>MULTIPLAYER</h3>
            <img alt="close" title="Exit Room" src={cross} on:click={leaveRoom}/>
        </div>
        <div class="subheading flexi">
            {#if room.room_id == 0}
            <h5>RoomID: Not joined</h5>
            <h5>Password: xxxxx</h5>
            {:else}
            <div class="gridy">

                <h5>RoomID:</h5>
                <h5>{room.room_id}</h5>
                <h5>Password</h5>

                <h5 class="flexi"><input type={showPassword ? "text" : "password"} disabled value={room.password} />
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <img
                    src={showPassword ? eyeClose : eyeOpen}
                    alt=""
                    height="20px"
                    width="20px"
                    on:click={() => {
                        showPassword = !showPassword;
                    }}
            />
            </h5>
    </div>
            {/if}
        </div>
        <div class="rest">
            <div class="roominfo flexi">
                {#if room.room_id == 0}
                <p> Please create or join a room first</p>
                {:else}
                <div class="persons">
                    {#each room.players as player,ind }
                        <Player player={player} color={COLORS[ind]} you={room.device_player?.name == player.name}/>
                    {/each}
                </div>
                {/if}
            </div>
            {#if room.room_id == 0}
            <div class="joinorcreate flexi">
                <div class="buttonDiv">
                    <button on:click={joinRoom}>JOIN</button>
                </div>
                <div class="or">OR</div>
                <div class="buttonDiv">
                    <button on:click={createRoom}>CREATE</button>
                </div>
            </div>
            {/if}
        </div>
    </section>
</main>

<style>
    *{
        box-sizing: border-box;
    }
    .flexi{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    main {
        z-index: 10;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100vw;
        color: white;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: scroll;
        transition: all 0.5s ease-in-out;
    }
    h3,h5{
        margin: 0;
        text-align: center;
    }
    h5{
        padding: 5px;
        font-weight: 400;
    }
    .roomarea{
        background-color: black;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 20px 40px #212121,0 -10px 60px #212121;
        width: min(50%,500px);
        border: 0.5px solid #212121;
        position: relative;
    }
    .heading{
        margin: 0.5rem 0;
        color: #FDBA74;
    }
    .heading img{
        height: 15px;
        width: 15px;
        position: absolute;
        right: 15px;
        cursor: pointer;
    }
    .subheading{
        flex-direction: column;
        border-bottom: #39cab760 0.1px solid;
    }
    .rest{
        display: flex;
        background-color: #39cab760;
        margin: 5px;
        gap: 1px;
    }
    .gridy{
        width: 50%;
        display: grid;
        columns: 2;
        grid-template-columns: auto auto;
    }
    .persons{
        width: 100%;
        margin: 10px;
        height: 100%;
        background-color: #030712;
    }
    button{
        background-color: #38BDF8;
    }
    .buttonDiv{
        margin: 20px;
    }
    .or{
        font-size: 11px;
        position: relative;
        width: 100%;
        text-align: center;
        background: black;
        padding: 0 10px;
    }
    .or::after{
        content: '';
        width: 100%;
        position: absolute;
        left: 0;
        top: 50%;
        height: 1px;
        background-color: #39cab760;
    }
    .roominfo{
        flex: 3;
        background-color: black;
    }
    .roominfo p{
        font-size: 12px;
    }
    .joinorcreate{
        flex: 1;
        flex-direction: column;
        background-color: black;
    }
    input{
        border: none;
        background: inherit;
        padding: 0;
        width: 110px;
        color: white;
        text-align: center;
    }
    @media (max-width: 600px){
        .gridy{
            width: 100%;
        }
        .rest{
            flex-direction: column;
        }
        .persons{
            min-height: 80px;
        }

    }
    @media(max-width:800px){
        .roomarea{
            width: 100%;
        }
    }
</style>

