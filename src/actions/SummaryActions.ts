// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import { SummaryProgressStatus, ViewType } from "../store/SummaryStore";
import * as actionSDK from "@microsoft/m365-action-sdk";

export enum HttpStatusCode {
    Unauthorized = 401,
    NotFound = 404,
}

export enum GameSummaryAction {
    initialize = "initialize",
    setContext = "setContext",
    setDueDate = "setDueDate",
    setGameTitle = "SetGameTitle",
    showMoreOptions = "showMoreOptions",
    setProgressStatus = "setProgressStatus",
    goBack = "goBack",
    fetchUserDetails = "fetchUserDetails",
    fetchActionInstanceRows = "fetchActionInstanceRows",
    fetchActionInstance = "fetchActionInstance",
    fetchActionInstanceSummary = "fetchActionInstanceSummary",
    fetchLocalization = "fetchLocalization",
    setActionInstance = "setActionInstance",
    fetchMyScore = "fetchMyScore",
    fetchLeaderBoard = "fetchLeaderBoard",
    setGameStatus = "setGameStatus",
    setLeaderboardVisibilityFlag = "setLeaderboardVisibilityFlag",
}

export let initialize = action(GameSummaryAction.initialize);

export let fetchUserDetails = action(GameSummaryAction.fetchUserDetails, (userIds: string[]) => ({
    userIds: userIds
}));

export let setGameStatus = action(GameSummaryAction.setGameStatus, (status: actionSDK.ActionStatus) => ({
    status:status
}));

export let setLeaderboardVisibilityFlag = action(GameSummaryAction.setLeaderboardVisibilityFlag);

export let fetchActionInstanceRows = action(GameSummaryAction.fetchActionInstanceRows)

export let fetchMyScore = action(GameSummaryAction.fetchMyScore,  (myScore: actionSDK.ActionDataRow[]) => ({
    myScore:myScore
}));

export let fetchLeaderBoard = action(GameSummaryAction.fetchLeaderBoard, (scores: actionSDK.ActionDataRow[]) => ({
    scores:scores
}));

export let fetchLocalization = action(GameSummaryAction.fetchLocalization);

export let setProgressStatus = action(GameSummaryAction.setProgressStatus, (status: Partial<SummaryProgressStatus>) => ({
    status: status
}));

export let setContext = action(GameSummaryAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let setDueDate = action(GameSummaryAction.setDueDate, (date: number) => ({
    date: date
}));

export let setGameTitle = action(GameSummaryAction.setGameTitle, (title: string) => ({
    title: title
}));

export let showMoreOptions = action(GameSummaryAction.showMoreOptions, (showMoreOptions: boolean) => ({
    showMoreOptions: showMoreOptions
}));

export let setActionInstance = action(GameSummaryAction.setActionInstance, (actionInstance: actionSDK.Action) => ({
    actionInstance: actionInstance
}));


