<script lang="ts">
    import type { Player } from "../Helpers/room";
    import del from "../../assets/delete.svg";

    export let player:Player;
    export let color;
    export let you:Boolean;
    
</script>

<main style="--color_m:{color}">
    <div class="info">
        <div class="name">
            <p>{player.name}</p>
            {#if you}
                <div class="you">
                    YOU
                </div>
            {/if}
            {#if player.admin}
                <div class="you">
                    admin
                </div>
            {/if}
        </div>
        <div class="joined">
        <p>
            {player.joined_at}
        </p>
        </div>
    </div>
    <div class="details">
        <div class="detail_info">
            Won: {player.won}
        </div>
        <div class="detail_info">
            Lost: {player.lost}
        </div>
    </div>
    <!-- <img alt="" src={del}/> -->
</main>

<style>
    *{
        box-sizing: border-box;
    }
    .you{
        background-color: var(--color_m);
        font-size: xx-small;
        filter: hue-rotate(20deg);
        height: fit-content;
        padding: 1px 5px;
        border-radius: 10px;
    }
    .details{
        font-size: 12px;
        margin-right: 10px;
    }
    main{
        width: 100%;
        background-color: var(--color_m);
        height: 50px;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    img{
        height: 15px;
        width: 15px;
        cursor: pointer;
        margin-right: 10px;
    }
    p{
        margin:0;
    }
    .info{
        padding: 5px;
    }
    .name{
        display: flex;
        align-items: center;
        gap:10px;
        font-size: 15px;
    }
    .joined{
        font-size: 10px;
    }
    @media (max-width:500px){
        main{
            width:100%;
        }
    }

</style>