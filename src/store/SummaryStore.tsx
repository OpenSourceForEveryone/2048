// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import { ProgressState } from "./../utils/SharedEnum";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Utils } from "../utils/Utils";
import "./../orchestrators/SummaryOrchectrator";
import "./../mutator/SummaryMutator";


export enum ViewType {
    Main
}

export interface MyGameScore {
    score: string,
    timeStamp: string
}

export interface LeaderBoard {
    playerId: string,
    playerName: string,
    score: string
}

export interface SummaryProgressStatus {
    actionInstance: ProgressState;
    currentContext: ProgressState;
    settingInstance: ProgressState;
    leaderboardDatAInstance: ProgressState;
    myScoreDataInstance: ProgressState;
    localizationInstance: ProgressState;
}

interface IGameSummaryStore {
    context: actionSDK.ActionSdkContext;
    actionInstance: actionSDK.Action;
    actionSummary: actionSDK.ActionDataRowsSummary;
    dueDate: number;
    title: string;
    scoreBoard: MyGameScore[],
    leaderBoard: LeaderBoard[],
    isGameExpired: boolean,
    currentView: ViewType;
    continuationToken: string;
    actionInstanceRows: actionSDK.ActionDataRow[];
    myRow: actionSDK.ActionDataRow;
    userProfile: { [key: string]: actionSDK.SubscriptionMember };
    nonResponders: actionSDK.SubscriptionMember[];
    memberCount: number;
    showMoreOptionsList: boolean;
    isPollCloseAlertOpen: boolean;
    isChangeExpiryAlertOpen: boolean;
    isDeletePollAlertOpen: boolean;
    progressStatus: SummaryProgressStatus;
    isActionDeleted: boolean;
    local: string;
    isLeaderBoardVisible: boolean;

}

const store: IGameSummaryStore = {
    context: null,
    actionInstance: null,
    actionSummary: null,
    myRow: null,
    dueDate: Utils.getDefaultExpiry(7).getTime(),
    title: null,
    leaderBoard: [],
    scoreBoard: [],
    currentView: ViewType.Main,
    actionInstanceRows: [],
    continuationToken: null,
    showMoreOptionsList: false,
    isGameExpired: false,
    isPollCloseAlertOpen: false,
    isChangeExpiryAlertOpen: false,
    isDeletePollAlertOpen: false,
    userProfile: {},
    nonResponders: null,
    memberCount: null,
    progressStatus: {
        actionInstance: ProgressState.NotStarted,
        currentContext: ProgressState.NotStarted,
        settingInstance: ProgressState.NotStarted,
        leaderboardDatAInstance: ProgressState.NotStarted,
        myScoreDataInstance: ProgressState.NotStarted,
        localizationInstance: ProgressState.NotStarted 
    },
    isActionDeleted: false,
    local: "en-us",
    isLeaderBoardVisible: false
};

export default createStore<IGameSummaryStore>("summaryStore", store);
