<script lang="ts">
    import { onMount } from "svelte";
    import type { PopUp } from "../Helpers/PopUp";

    export let PopUpObj: PopUp;
    let title = PopUpObj.title;
    let content = PopUpObj.message;
    let inputHints = PopUpObj.inputHints;
    let afterDialog = PopUpObj.afterMessage;
    let cancelOn = PopUpObj.cancelOn;
    let x: number;

    onMount(() => {
        if (PopUpObj.totalTime != 0) {
            let count = 0;
            const progressDiv = document.getElementsByClassName(
                "progressDiv",
            )[0] as HTMLElement;
            if (progressDiv != null) {
                progressDiv.style.width = "0";
            }
            let incrementUnit = (PopUpObj.totalTime / 300) | 0;
            x = setInterval(() => {
                if (progressDiv != null) {
                    progressDiv.style.width =
                        (count / PopUpObj.totalTime) * 100 + "%";
                }
                count += incrementUnit;
                if (count >= PopUpObj.totalTime) {
                    clearInterval(x);
                    PopUpObj.isOn = false;

                    if (afterDialog) {
                        afterDialog([false]); // unexpected situation that intervalgot clear because this must not occur in case of askPopUp
                    }
                    PopUpObj.clear();
                }
            }, incrementUnit);
        }
    });


    function onSubmit(){
        const answers = [];
        answers.push(true);
        if (inputHints.length != 0) {
            const inputs =
                document.getElementsByTagName("input");
            for (let input of inputs) {
                if (input.value.length == 0) {
                    alert("Empty fields not allowed");
                    return;
                }
                answers.push(input.value);
            }
        }

        PopUpObj.isOn = false;
        if (PopUpObj.interval != null) {
            clearInterval(PopUpObj.interval);
            clearInterval(x);
        }

        if (afterDialog) {
            afterDialog(answers);
        }
        PopUpObj.clear();
    }

    function onCancel(){
        PopUpObj.isOn = !false;
        if (PopUpObj.interval != null) {
            clearInterval(PopUpObj.interval);
            clearInterval(x);
        }
        if (afterDialog) {
            afterDialog([false]);
        }
        PopUpObj.clear();
        // console.log(PopUpObj.answers)
    }

</script>

<div class="popUp Box">
    <div class="popUpTitleBox">
        <div class="progressDiv" />
        <p>{title}</p>
    </div>
    <div class="restBox">
        <div class="popUpContentBox">
            <p>{content}</p>
        </div>
        <form on:submit={onSubmit}>
            {#if inputHints.length != 0}
                <div class="inputBox">
                    {#each inputHints as inputHint}
                        <input type="text" placeholder={inputHint} required />
                    {/each}
                </div>
            {/if}
            <div class="buttonDiv">
                <button type="submit">Ok</button>
                {#if cancelOn}
                    <button 
                        on:click={onCancel}>Cancel</button
                    >
                {/if}
            </div>
        </form>
    </div>
</div>

<style>
    .progressDiv {
        width: 0;
        background-color: #ffcdd2;
        transition: all 0.0000001s ease-in;
        height: 5px;
    }
    .popUp {
        color: #ede7f6;
        display: flex;
        flex-direction: column;
        position: absolute;
        align-items: center;
        height: auto;
        overflow-x: scroll;
        overflow-y: scroll;
    }

    .popUpTitleBox {
        width: 100%;
        margin: 0 30px;
        padding-bottom: 5px;
        background-color: #ef5350;
        flex: 1;
    }

    .popUpTitleBox p {
        /* margin: 1px; */
        margin: 0;
        margin-top: 5px;
        text-align: center;
        font-size: 20px;
    }

    .restBox {
        flex: 12;
        width: 100%;
        padding: 10px;
        margin: 0 30px;
        display: flex;
        flex-direction: column;
        background-color: black;
    }

    .popUpContentBox {
        width: 100%;
        text-overflow: ellipsis;
        overflow-y: scroll;
        flex: 3;
        /* border-top: solid 1px #212121; */
    }

    .popUpContentBox p {
        margin: 3px;
        text-align: center;
        font-size: 13px;
    }

    .Box {
        max-width: 60%;
        max-height: 80%;
    }

    .buttonDiv {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        font-size: 11px;
        bottom: 0px;
        padding: 5px 0;
        height: 30px;
        gap: 10px;
    }

    .inputBox {
        display: flex;
        height: 30%;
        max-width: 100%;
        flex-wrap: wrap;
        margin: 20px 5px;
        gap: 5px;
        align-items: center;
        justify-content: center;
        border-top: black solid 1px;
    }
    input {
        margin: 3px;
        height: 30px;
        width: 80px;
        font-size: 13px;

        text-overflow: ellipsis;
        overflow-x: scroll;
        background-color: #424242;
        border: none;
        padding: 2px  5px;
        box-shadow: 0 0 2px black inset;
        border-radius: 5px;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 900px) {
        .Box {
            max-width: 80%;
        }
    }
</style>
