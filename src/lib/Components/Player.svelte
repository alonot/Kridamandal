<script lang="ts">
    import type { Player } from "../Helpers/room";
    import del from "../../assets/delete.svg";

    export let player:Player;
    export let color;
    
</script>

<main style="--color_m:{color}">
    <div class="info">
        <div class="name">
            <p>{player.name}</p>
        </div>
        <div class="joined">
        <p>
            {player.joinedAt}
        </p>
        </div>
    </div>
    <img alt="" src={del}/>
</main>

<style>
    main{
        width: max(250px,30%);
        background-color: var(--color_m);
        height: 50px;
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