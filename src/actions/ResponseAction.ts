// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { GameStatus, ResponseProgressStatus } from "../store/ResponseStore";

export enum GameResponseAction {
    initialize = "initialize",
    setContext = "setContext",
    setActionInstance = "setActionInstance",
    fetchActionInstance = "fetchActionInstance",
    fetchActionInstanceRowsForCurrentUser = "fetchActionInstanceRowsForCurrentUser",
    shouldValidateUI = "shouldValidateUI",
    setSendingFlag = "setSendingFlag",
    setProgressState = "setProgressState",
    setIsActionDeleted = "setIsActionDeleted",
    setPreviousScore = "setPreviousScore",
    addScore = "addScore",
    addScoreForSinglePlay = "addScoreForSinglePlay",
    setShouldPlayerPlay = "setShouldPlayerPlay",
    updateGameScore = "updateGameScore",
    updateGameBoard = "updateGameBoard",
    setGameStatus = "setGameStatus",
    addItemToGameBoard = "addItemToGameBoard",
    updateInstructionPageView = "updateInstructionPageView",
}

export let initialize = action(GameResponseAction.initialize);

export let setContext = action(GameResponseAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let setActionInstance = action(GameResponseAction.setActionInstance, (actionInstance: actionSDK.Action) => ({
    actionInstance: actionInstance
}));

export let setShouldPlayerPlay = action(GameResponseAction.setShouldPlayerPlay);
export let setPreviousScore = action(GameResponseAction.setPreviousScore);

export let fetchActionInstanceRowsForCurrentUser = action(GameResponseAction.fetchActionInstanceRowsForCurrentUser, (actionInstanceRow: actionSDK.ActionDataRow[]) => ({
    actionInstanceRow: actionInstanceRow
}));

export let shouldValidateUI = action(GameResponseAction.shouldValidateUI, (shouldValidate: boolean) => ({
    shouldValidate: shouldValidate
}));

export let setSendingFlag = action(GameResponseAction.setSendingFlag, (value: boolean) => ({
    value: value
}));

export let setProgressState = action(GameResponseAction.setProgressState, (status: Partial<ResponseProgressStatus>) => ({
    status: status
}));

export let setIsActionDeleted = action(GameResponseAction.setIsActionDeleted, (value: boolean) => ({
    value: value
}));

export let addScore = action(GameResponseAction.addScore, (score: string) => ({
    score: score
}));

export let addScoreForSinglePlay = action(GameResponseAction.addScoreForSinglePlay, (score: string) => ({
    score: score
}));

export let setGameStatus = action(GameResponseAction.setGameStatus, (status: Partial<GameStatus>) => ({
    status: status
}));

export let updateGameBoard = action(GameResponseAction.updateGameBoard, (board: any[]) => ({
    board: board
}));

export let updateGameScore = action(GameResponseAction.updateGameScore, (score: number) => ({
    score: score
}));

export let addItemToGameBoard = action(GameResponseAction.addItemToGameBoard, (row: number, column: number, value: number) => ({
    row: row,
    column: column,
    value: value
}));

export let updateInstructionPageView = action(GameResponseAction.updateInstructionPageView);
