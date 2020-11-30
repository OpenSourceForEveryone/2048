
import { action } from "satcheljs";
import { GameView } from "../store/UpdationStore";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "./../utils/SharedEnum";

export enum GameUpdationAction {
    initialize = "initialize",
    setContext = "setContext",
    addScore = "addScore",
    shouldValidateUI = "shouldValidateUI",
    setSendingFlag = "setSendingFlag",
    setProgressState = "setProgressState",
    goToPage = "goToPage",
    fetchLocalization = "fetchLocalization",
}

export let initialize = action(GameUpdationAction.initialize);

export let setContext = action(GameUpdationAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let goToPage = action(GameUpdationAction.goToPage, (page: GameView) => ({
    page: page
}));

export let addScore = action(GameUpdationAction.addScore, (score: string) => ({
    score: score
}));

export let setProgressState = action(GameUpdationAction.setProgressState, (state: ProgressState) => ({
    state: state
}));

export let shouldValidateUI = action(GameUpdationAction.shouldValidateUI, (shouldValidate: boolean) => ({
    shouldValidate: shouldValidate
}));

export let fetchLocalization = action(GameUpdationAction.fetchLocalization);


