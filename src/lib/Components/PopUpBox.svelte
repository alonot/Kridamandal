<script>
    export let PopUpObj;
    let title = PopUpObj.title;
    let content = PopUpObj.message;
    let displayPopUp = PopUpObj.isOn;
    let inputHints = PopUpObj.inputHints;

</script>

<div class="popUp Box">
    <div class="popUpTitleBox">
        <p>{title}</p>
    </div>
    <div class="popUpContentBox">
        <p>{content}</p>
    </div>
    {#if inputHints.length != 0}
    <div class="inputBox">
        {#each inputHints as inputHint}
            <input type="text" placeholder={inputHint}/>
        {/each}
    </div>
    {/if}
    <div class="buttonDiv">
        <button on:click={ () => {
            PopUpObj.isOn = !PopUpObj.isOn;
        }} >Ok</button>
    </div>

</div>

<style>
    .popUp{
        background-color: #37474F;
        color: #EDE7F6;
        display: flex;
        flex-direction: column;
        position: absolute;
        align-items: center;
        height: auto;
        overflow-x: scroll;
        overflow-y: scroll;
        padding: 5px;
    }

    .popUpTitleBox{
        width: 100%;
        min-height: 50%;
    }

    .popUpTitleBox p {
        margin: 1px;
        text-align: center;
        font-size: 20px;
    }

    .popUpContentBox{
        width:100%;
        text-overflow: ellipsis;
        overflow-y: scroll;
        border-top: solid 1px #212121;
    }

    .popUpContentBox p{
        margin: 3px;
        text-align: center;
        min-height: 50px;
        font-size: 11px;
    }

    .Box{
        min-width: 200px;
        min-height: 200px;
        max-width: 80%;
        border-radius: 10px;
        border-radius: 5px;
        max-height: 80%;
        box-shadow: 0 0 50px 20px #424242;
        box-shadow: 0 0 10px inset gray;
    }

    .buttonDiv{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        /* border-top: solid 1px #212121;    */
        font-size: 11px;
        bottom: 0px;
        padding: 5px 0;
        height: 30px;
    }

    .inputBox{
        display: flex;
        height: 30%;
        max-width: 100%;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        border-top: black solid 1px;
    }
    input{
        margin: 3px;
        height: 25px;
        width: 80px;

        text-overflow: ellipsis;
        overflow-x: scroll;
        background-color: #424242;
        border: none;
        box-shadow: 0 0 2px black inset;
        border-radius: 5px;
    }

    ::-webkit-scrollbar{
        display: none;
    }
</style>