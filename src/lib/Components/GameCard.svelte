<script lang="ts">

    export let name;
    export let color;
    export let onClick;
</script>

    
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gameCard" on:click={
    onClick(name)
    } style="--i:{color}">
    <div class="name">
        {name}
    </div>
</div>

<style>
    .gameCard{
        width:100px;
        height:100px;
        background-color: var(--i);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s ease-in-out;
        z-index: 9;
        position: relative;
        cursor: pointer;
    }
    .name{
        font-size: 10px;
        text-align: center;
        color:black;
    }

    .gameCard:hover{
        border: 10px black;
        box-shadow: 0 0 20px inset black;
    }

    @media (max-width:900px){
        .gameCard{
            width: 70px;
            height: 70px;
        }
    }

      
</style>

