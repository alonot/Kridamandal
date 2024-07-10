<script lang="ts">
    import type { Room } from "../Helpers/room";
    import eyeClose from "../../assets/eye-closed.svg"
    import eyeOpen from "../../assets/eye-open.svg"
    import cross from "../../assets/cross.svg"
    import Player from "./Player.svelte";
    import { COLORS } from "../Helpers/util";
    import { onMount } from "svelte";

    export let room: Room;
    let roomarea:HTMLElement;
    let mainarea:HTMLElement;
    onMount(()=>{
        const bounds = roomarea.getBoundingClientRect()
        mainarea.onclick=(e)=>{
            if (e.clientX > bounds.right || e.clientX < bounds.left || e.clientY > bounds.bottom && e.clientY < bounds.top  ){
                room.show = false;
            }
        }
    })


    let availableColors = structuredClone(COLORS)
    const colors:string[] = [];
    let len = 6;
    room.players.forEach((player)=>{
        const colorInd = (Math.random() * 100 | 0) % len
        colors.push(availableColors[colorInd])
        availableColors = availableColors.filter((val,ind)=>{
            if (ind != colorInd) return val
        });
        len--
    })

    let showPassword = false;

</script>

<main bind:this={mainarea} style="transform: translateY({room.show ? "0vh" : "-100vh"});">
    <section bind:this={roomarea} class="roomarea">
        <div class="heading flexi">
            <h3>MULTIPLAYER</h3>
            <img alt="close" src={cross} on:click={()=>{room.show = false}}/>
        </div>
        <div class="subheading flexi">
            {#if room.roomId == 0}
            <h5>RoomID: Not joined</h5>
            <h5>Password: xxxxx</h5>
            {:else}
            <div class="gridy">

                <h5>RoomID:</h5>
                <h5>{room.roomId}</h5>
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
                {#if room.roomId == 0}
                <p> Please create or join a room first</p>
                {:else}
                <div class="persons">
                    {#each room.players as player,ind }
                        <Player player={player} color={colors[ind]}/>
                    {/each}
                </div>
                {/if}
            </div>
            <div class="joinorcreate flexi">
                <div class="buttonDiv">
                    <button>JOIN</button>
                </div>
                <div class="or">OR</div>
                <div class="buttonDiv">
                    <button>CREATE</button>
                </div>
            </div>
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
        background: rgba(89, 83, 83, 0.549);
        overflow-y: scroll;
        transition: all 0.6s ease-in-out;
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
        width: min(50%,410px);
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

