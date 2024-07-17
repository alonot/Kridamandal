<script lang="ts">
    import type { Player as p } from "$lib/Helpers/room";
    import cross from "$lib/assets/cross.svg"
    import Player from "./Player.svelte";
    import { COLORS, DIALOG } from "$lib/Helpers/util";
    import { getContext } from "svelte";

    export let players: p[];
    export let device_player: string;
    export let closeThis: Function;
    export let afterMessage: Function | undefined;

    function close() {
        closeThis();
        if (afterMessage) afterMessage([false]);
    }

    let player_status:{ [key: string] : boolean } = {};
    let selected_players: string[] = []

    players.forEach((p)=>{
        player_status[p.name] = false
    })

    function select(player_name: string) {
        player_status[player_name] = !player_status[player_name]
        if (!player_status[player_name]){
            selected_players = selected_players.filter((val)=>{
                if (val != player_name) return val
            })
        }else{
            if (selected_players.length == 2){
                player_status[selected_players[0]] = false
                selected_players = [selected_players[1]]
            }
            selected_players.push(player_name)
            selected_players = selected_players 
        }
    }
    const displayPopUp: Function = getContext(DIALOG);

    function OKClicked() {
        selected_players = []
        for (let key in player_status){
            if(player_status[key]){
                selected_players.push(key)
            }
        }
        closeThis()
        if (selected_players.length != 2) {
            displayPopUp("Alert", "Please select 2 players to play", 2000);
        } else {
            if (afterMessage) {
                afterMessage([true, selected_players]);
            }
        }
    }
</script>

<main>
    <section class="roomarea">
        <div class="heading flexi">
            <h3>Select Players: {selected_players.length}</h3>
            <img alt="Cancel" title="Cancel" src={cross} on:click={close} />
        </div>
        <div class="rest">
            <div class="roominfo flexi">
                <div class="persons">
                    {#each players as player, ind}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class={player_status[player.name] ? "aplayer" : ""} style="--color_Y:{COLORS[ind]}" on:click={()=>{select(player.name)}}>
                            <Player
                                {player}
                                color={COLORS[ind]}
                                you={device_player == player.name}
                            />
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <form class="buttonDiv" on:submit={OKClicked}>
            <button type="submit">Ok</button>
        </form>
    </section>
</main>

<style>
    * {
        box-sizing: border-box !important;
    }
    .flexi {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    main {
        z-index: 10;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        color: white;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: scroll;
        transition: all 0.5s ease-in-out;
    }
    h3 {
        margin: 0;
        text-align: center;
    }
    .roomarea {
        background-color: black;
        padding: 10px;
        border-radius: 5px;
        box-shadow:
            0 20px 40px #212121,
            0 -10px 60px #212121;
        width: min(50%, 500px);
        border: 0.5px solid #212121;
        position: relative;
    }
    .heading {
        margin: 0.5rem 0;
        color: #fdba74;
    }
    .heading img {
        height: 15px;
        width: 15px;
        position: absolute;
        right: 15px;
        cursor: pointer;
    }
    .aplayer{
        position: relative;
    }
    .aplayer::before{
        content: '';
        position: absolute;
        top: 0;
        box-sizing: border-box;
        left: 0;
        border: 3px solid var(--color_Y);
        box-shadow: 0 0 50px inset black;
        filter: hue-rotate(45deg) brightness(2);
        width: 100%;
        height: 100%;

    }
    .rest {
        display: flex;
        background-color: #39cab760;
        margin: 5px;
        gap: 1px;
    }
    .persons {
        width: 100%;
        margin: 10px;
        height: 100%;
        cursor: pointer;
        background-color: #030712;
    }
    .persons div{
        margin: 5px 0;
    }
    button {
        background-color: #38bdf8;
    }
    .buttonDiv {
        margin: 20px;
    }
    .roominfo {
        flex: 3;
        background-color: black;
    }
    @media (max-width: 600px) {
        .rest {
            flex-direction: column;
        }
        .persons {
            min-height: 80px;
        }
    }
    @media (max-width: 800px) {
        .roomarea {
            width: 100%;
        }
    }
</style>
