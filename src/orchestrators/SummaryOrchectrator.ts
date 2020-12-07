// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toJS } from "mobx";
import { Logger } from "./../utils/Logger";
import { Constants } from "../utils/Constants";
import { Localizer } from "../utils/Localizer";
import {
    initialize,
    setProgressStatus,
    setContext,
    fetchLocalization,
    fetchUserDetails,
    fetchMyScore,
    fetchLeaderBoard,
    setGameTitle,
    setGameStatus,
    setLeaderboardVisibilityFlag,
    setDueDate,
    setActionInstance
} from "../actions/SummaryActions";
import { orchestrator } from "satcheljs";
import { ProgressState } from "../utils/SharedEnum";
import getStore from "../store/SummaryStore";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";


/**
 * Summary view orchestrators to fetch data for current action, perform any action on that data and dispatch further actions to modify stores
 */


orchestrator(initialize, async () => {
    let currentContext = getStore().progressStatus.currentContext;
    if (currentContext == ProgressState.NotStarted || currentContext == ProgressState.Failed) {
        setProgressStatus({ currentContext: ProgressState.InProgress });
        let actionContext = await ActionSdkHelper.getActionContext();
        if (actionContext.success) {
            let context = actionContext.context as actionSDK.ActionSdkContext;
            setContext(context);
            let actionInstance =  await ActionSdkHelper.getAction(context.actionId);
            let response = await Localizer.initialize();
            if(actionInstance.success && response){
                setActionInstance(actionInstance.action);
                setGameTitle(actionInstance.action.dataTables[0].dataColumns[0].displayName);
                setDueDate(actionInstance.action.expiryTime);
                setGameStatus(actionInstance.action.status);
                fetchUserDetails([context.userId]);
                let myDataRows = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId, actionContext.context.userId);
                if(myDataRows.success){
                    fetchMyScore(myDataRows.dataRows);
                }
                let leaderBoardDataRows = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId);
                if(leaderBoardDataRows.success){
                    fetchLeaderBoard(leaderBoardDataRows.dataRows);
                }
                setLeaderboardVisibilityFlag();
                setProgressStatus({ currentContext: ProgressState.Completed });
            }
            else
            {
                setProgressStatus({ currentContext: ProgressState.Failed });
            }
        } else {
            setProgressStatus({ currentContext: ProgressState.Failed });
        }
    }
});

