// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mutator } from "satcheljs";
import getStore, { LeaderBoard, ViewType } from "./../store/SummaryStore";
import {
    setProgressStatus, setContext, updateMyRow, pollCloseAlertOpen, pollExpiryChangeAlertOpen, pollDeleteAlertOpen, setDueDate, setGameTitle,
    showMoreOptions, setCurrentView, addActionInstanceRows, updateContinuationToken, updateMemberCount, goBack, updateNonResponders,
    setIsActionDeleted, updateActionInstance, updateActionInstanceSummary, updateUserProfileInfo, fetchScore, fetchLeaderBoard, setGameStatus, setLeaderboardFlag
} from "./../actions/SummaryActions";
import { Utils } from "../utils/Utils";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { UxUtils } from "../utils/UxUtils";

/**
 * Summary view mutators to modify store data on which summmary view relies
 */

mutator(setProgressStatus, (msg) => {
    const store = getStore();
    store.progressStatus = {
        ...getStore().progressStatus,
        ...msg.status,
    };
});

mutator(setContext, (msg) => {
    const store = getStore();
    store.context = msg.context;
});

mutator(updateMyRow, (msg) => {
    const store = getStore();
    store.myRow = msg.row;
});

mutator(pollCloseAlertOpen, (msg) => {
    const store = getStore();
    store.isPollCloseAlertOpen = msg.open;
});

mutator(pollExpiryChangeAlertOpen, (msg) => {
    const store = getStore();
    store.isChangeExpiryAlertOpen = msg.open;
});

mutator(pollDeleteAlertOpen, (msg) => {
    const store = getStore();
    store.isDeletePollAlertOpen = msg.open;
});

mutator(setDueDate, (msg) => {
    const store = getStore();
    store.dueDate = msg.date;
});

mutator(setGameTitle, (msg) => {
    const store = getStore();
    store.title = store.actionInstance.dataTables[0].dataColumns[0].displayName;
});

mutator(setGameStatus, () => {
    const store = getStore();

    if (store.actionInstance && store.actionInstance.status === actionSDK.ActionStatus.Active) {
        store.isGameExpired = false;
    } else {
        store.isGameExpired = true;
    }
});

mutator(setLeaderboardFlag, () => {
    const store = getStore();
    if (store.context && store.actionInstance) {
        const creatorId = store.actionInstance.creatorId;
        const currentUserId = store.context.userId;
        const datarowVisibility = store.actionInstance.dataTables[0].rowsVisibility;
        if (creatorId === currentUserId || datarowVisibility === actionSDK.Visibility.All) 
        {
            getStore().shouldShowLeaderBoard = true;
        } else {
            getStore().shouldShowLeaderBoard = false;
        }
    }
});

mutator(fetchScore, () => {
    const store = getStore();
    let rows: actionSDK.ActionDataRow[] = store.actionInstanceRows;
    let context: actionSDK.ActionSdkContext = store.context;
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    if (rows && rows.length > 0) {
        rows.forEach(element => {
            if (context.userId === element.creatorId) {
                getStore().scoreBoard.push(
                    {
                        score: element.columnValues["2"],
                        timeStamp: UxUtils.formatDate(new Date(element.createTime), 
                        getStore().actionInstance.customProperties[0].value,
                        options)
                    }
                )
            }
        });
    }
});

mutator(fetchLeaderBoard, () => {
    let store = getStore();
    let rows: actionSDK.ActionDataRow[] = store.actionInstanceRows;
    if (rows && rows.length > 0) {
        rows.forEach(element => {
            const player = getStore().leaderBoard.find(p => p.playerId === element.creatorId);
            if (player) {
                if (Number(element.columnValues["2"]) > Number(player.score)) {
                    getStore().leaderBoard.find(p => p.playerId === element.creatorId).score = element.columnValues["2"]
                }
            }
            else {
                getStore().leaderBoard.push(
                    {
                        playerId: element.creatorId,
                        playerName: element.columnValues["1"],
                        score: element.columnValues["2"],
                    }
                )
            }
        });
        
        getStore().leaderBoard.sort(function (a, b) {
            return Number(b.score) - Number(a.score);
        });
    }
})


mutator(showMoreOptions, (msg) => {
    const store = getStore();
    store.showMoreOptionsList = msg.showMoreOptions;
});

mutator(setCurrentView, (msg) => {
    const store = getStore();
    store.currentView = msg.viewType;
});

mutator(addActionInstanceRows, (msg) => {
    const store = getStore();
    store.actionInstanceRows = store.actionInstanceRows.concat(msg.rows);
});

mutator(updateContinuationToken, (msg) => {
    const store = getStore();
    store.continuationToken = msg.token;
});

mutator(updateUserProfileInfo, (msg) => {
    const store = getStore();
    store.userProfile = Object.assign(store.userProfile, msg.userProfileMap);
});

mutator(updateMemberCount, (msg) => {
    const store = getStore();
    store.memberCount = msg.memberCount;
});

mutator(updateNonResponders, (msg) => {
    const store = getStore();
    const nonResponderList = msg.nonResponders;
    if (!Utils.isEmpty(nonResponderList) && nonResponderList.length > 0) {
        nonResponderList.sort((object1, object2) => {
            if (object1.displayName < object2.displayName) {
                return -1;
            }
            if (object1.displayName > object2.displayName) {
                return 1;
            }
            return 0;
        });
    }
    store.nonResponders = msg.nonResponders;
});

mutator(setIsActionDeleted, (msg) => {
    const store = getStore();
    store.isActionDeleted = msg.isActionDeleted;
});

mutator(updateActionInstance, (msg) => {
    const store = getStore();
    if (msg.actionInstance) {
        store.actionInstance = msg.actionInstance;
        store.dueDate = msg.actionInstance.expiryTime;
    }
});

mutator(updateActionInstanceSummary, (msg) => {
    const store = getStore();
    if (msg.actionInstanceSummary) {
        store.actionSummary = msg.actionInstanceSummary;
    }
});
