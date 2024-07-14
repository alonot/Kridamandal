<script lang="ts">
    export let message;

</script>

<main class="flexi">
    <div class="spinner">

    </div>
    <p>{message}</p>
</main>

<style>
    *{ 
        box-sizing: border-box;
    }
    p{
        text-align: center;
        color: white;
        font-size: 12px;
        max-width: max(150px,30%);
    }
    .flexi{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    main {
        z-index: 15;
        position: absolute;
        display: flex;
        flex-direction: column;
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
    .spinner{
		border: 8px solid #f3f3f3;
		border-top: 8px solid #1e1a17;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border-width: 5px;
        animation: spin 1s linear infinite;
    }
    @keyframes spin{
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>

