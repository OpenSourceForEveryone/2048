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
    addOptions = "addOptions",
    setDueDate = "setDueDate",
    setGameTitle = "SetGameTitle",
    setCurrentView = "setCurrentView",
    showMoreOptions = "showMoreOptions",
    actionInstanceRow = "actionInstanceRow",
    pollCloseAlertOpen = "pollCloseAlertOpen",
    pollExpiryChangeAlertOpen = "pollExpiryChangeAlertOpen",
    pollDeleteAlertOpen = "pollDeleteAlertOpen",
    updateNonResponders = "updateNonResponders",
    updateMemberCount = "updateMemberCount",
    updateUserProfileInfo = "updateUserProfileInfo",
    updateMyRow = "updateMyRow",
    setProgressStatus = "setProgressStatus",
    goBack = "goBack",
    fetchUserDetails = "fetchUserDetails",
    fetchActionInstanceRows = "fetchActionInstanceRows",
    fetchActionInstance = "fetchActionInstance",
    fetchActionInstanceSummary = "fetchActionInstanceSummary",
    fetchNonReponders = "fetchNonReponders",
    updateDueDate = "updateDueDate",
    closePoll = "closePoll",
    deletePoll = "deletePoll",
    updateContinuationToken = "updateContinuationToken",
    downloadCSV = "downloadCSV",
    fetchLocalization = "fetchLocalization",
    fetchMyResponse = "fetchMyResponse",
    fetchMemberCount = "fetchMemberCount",
    setIsActionDeleted = "setIsActionDeleted",
    updateActionInstance = "updateActionInstance",
    updateActionInstanceSummary = "updateActionInstanceSummary",
    fetchScore = "fetchScore",
    fetchLeaderBoard = "fetchScore",
}

export let initialize = action(GameSummaryAction.initialize);

export let fetchUserDetails = action(GameSummaryAction.fetchUserDetails, (userIds: string[]) => ({
    userIds: userIds
}));

export let fetchScore = action(GameSummaryAction.fetchScore)

export let fetchLeaderBoard = action(GameSummaryAction.fetchLeaderBoard)

export let fetchLocalization = action(GameSummaryAction.fetchLocalization);

export let fetchMyResponse = action(GameSummaryAction.fetchMyResponse);

export let fetchMemberCount = action(GameSummaryAction.fetchMemberCount);

export let fetchActionInstanceRows = action(GameSummaryAction.fetchActionInstanceRows, (shouldFetchUserDetails: boolean) => ({
    shouldFetchUserDetails: shouldFetchUserDetails
}));

export let fetchNonReponders = action(GameSummaryAction.fetchNonReponders);

export let fetchActionInstance = action(GameSummaryAction.fetchActionInstance, (updateProgressState: boolean) => ({
    updateProgressState: updateProgressState
}));
export let fetchActionInstanceSummary = action(GameSummaryAction.fetchActionInstanceSummary, (updateProgressState: boolean) => ({
    updateProgressState: updateProgressState
}));

export let updateDueDate = action(GameSummaryAction.updateDueDate, (dueDate: number) => ({
    dueDate: dueDate
}));

export let closePoll = action(GameSummaryAction.closePoll);

export let deletePoll = action(GameSummaryAction.deletePoll);

export let downloadCSV = action(GameSummaryAction.downloadCSV);

export let setProgressStatus = action(GameSummaryAction.setProgressStatus, (status: Partial<SummaryProgressStatus>) => ({
    status: status
}));

export let setContext = action(GameSummaryAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let updateMyRow = action(GameSummaryAction.updateMyRow, (row: actionSDK.ActionDataRow) => ({
    row: row
}));

export let pollCloseAlertOpen = action(GameSummaryAction.pollCloseAlertOpen, (open: boolean) => ({
    open: open
}));

export let pollExpiryChangeAlertOpen = action(GameSummaryAction.pollExpiryChangeAlertOpen, (open: boolean) => ({
    open: open
}));

export let pollDeleteAlertOpen = action(GameSummaryAction.pollDeleteAlertOpen, (open: boolean) => ({
    open: open
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

export let setCurrentView = action(GameSummaryAction.setCurrentView, (viewType: ViewType) => ({
    viewType: viewType
}));

export let addActionInstanceRows = action(GameSummaryAction.actionInstanceRow, (rows: actionSDK.ActionDataRow[]) => ({
    rows: rows
}));

export let updateContinuationToken = action(GameSummaryAction.updateContinuationToken, (token: string) => ({
    token: token
}));

export let updateUserProfileInfo = action(GameSummaryAction.updateUserProfileInfo, (userProfileMap: { [key: string]: actionSDK.SubscriptionMember }) => ({
    userProfileMap: userProfileMap
}));

export let updateMemberCount = action(GameSummaryAction.updateMemberCount, (memberCount) => ({
    memberCount: memberCount
}));

export let goBack = action(GameSummaryAction.goBack);

export let updateNonResponders = action(GameSummaryAction.updateNonResponders, (nonResponders: actionSDK.SubscriptionMember[]) => ({
    nonResponders: nonResponders
}));

export let setIsActionDeleted = action(GameSummaryAction.setIsActionDeleted, (isActionDeleted: boolean) => ({
    isActionDeleted: isActionDeleted
}));

export let updateActionInstance = action(GameSummaryAction.updateActionInstance, (actionInstance: actionSDK.Action) => ({
    actionInstance: actionInstance
}));

export let updateActionInstanceSummary = action(GameSummaryAction.updateActionInstanceSummary, (actionInstanceSummary: actionSDK.ActionDataRowsSummary) => ({
    actionInstanceSummary: actionInstanceSummary
}));
