<script lang="ts">
    import { onMount } from "svelte";
    import type { PopUp } from "../Helpers/PopUp";

    export let PopUpObj:PopUp;
    let title = PopUpObj.title;
    let content = PopUpObj.message;
    let inputHints = PopUpObj.inputHints;
    let x:number;

    onMount(()=>{
        if (PopUpObj.totalTime != 0){
            let count =0
            const progressDiv = document.getElementsByClassName("progressDiv")[0] as HTMLElement
            if (progressDiv != null){
                progressDiv.style.width = "0";
            }
            let incrementUnit = PopUpObj.totalTime / 300 | 0;
            x = setInterval(()=> {
                if (progressDiv != null){
                    progressDiv.style.width = (count / PopUpObj.totalTime * 100) + "%";
                }
                count += incrementUnit;
                if (count >= PopUpObj.totalTime){
                clearInterval(x);
                }
                
            },incrementUnit);
        }
    })

</script>

<div class="popUp Box">
    <div class="popUpTitleBox">
        <div class="progressDiv"/>
        <p>{title}</p>
    </div>
    <div class="restBox">
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
                if (PopUpObj.interval != null){
                    clearInterval(PopUpObj.interval)
                    clearInterval(x)
                }
                PopUpObj.answers = []
                if (inputHints.length != 0){
                    const inputs = document.getElementsByTagName("input")
                    for (let input of inputs){
                        PopUpObj.answers.push(input.value)
                    }
                }
                // console.log(PopUpObj.answers)
            }} >Ok</button>
        </div>
    </div>

</div>

<style>
    .progressDiv{
        width: 0;
        background-color: #FFCDD2;
        transition: all 0.0000001s ease-in;
        height: 5px;
    }
    .popUp{
        color: #EDE7F6;
        display: flex;
        flex-direction: column;
        position: absolute;
        align-items: center;
        height: auto;
        overflow-x: scroll;
        overflow-y: scroll;
        /* padding: 5px;     */
    }

    .popUpTitleBox{
        width: 100%;
        background-color: #EF5350;
        flex: 1;
    }

    .popUpTitleBox p {
        /* margin: 1px; */
        margin: 0;
        margin-top: 5px;
        text-align: center;
        font-size: 20px;
    }

    .restBox{
        flex: 12;
        width: 100%;
        padding: 5px;
        display: flex;
        flex-direction: column;
        background-color: black;
    }

    .popUpContentBox{
        width:100%;
        text-overflow: ellipsis;
        overflow-y: scroll;
        flex: 3;
        /* border-top: solid 1px #212121; */
    }

    .popUpContentBox p{
        margin: 3px;
        text-align: center;
        font-size: 11px;
    }

    .Box{
        max-width: 60%;
        /* border-radius: 10px;
        border-radius: 5px; */
        max-height: 80%;
        /* box-shadow: 0 0 50px 20px #424242;
        box-shadow: 0 0 10px inset gray; */
    }

    .buttonDiv{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
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

    @media (max-width:900px){
        .Box{
            max-width: 80%;
        }
    }
</style>