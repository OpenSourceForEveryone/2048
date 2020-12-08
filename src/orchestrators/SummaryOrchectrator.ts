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
            setProgressStatus({ currentContext: ProgressState.Completed });

            setProgressStatus({ actionInstance: ProgressState.InProgress });
            let actionInstance =  await ActionSdkHelper.getAction(context.actionId);
            setProgressStatus({ localizationInstance: ProgressState.InProgress });
            let response = await Localizer.initialize();

            if(actionInstance.success && response){
                setProgressStatus({ localizationInstance: ProgressState.Completed });
                setActionInstance(actionInstance.action);
                setProgressStatus({ actionInstance: ProgressState.Completed });

                setProgressStatus({ settingInstance: ProgressState.InProgress });
                setGameTitle(actionInstance.action.dataTables[0].dataColumns[0].displayName);
                setDueDate(actionInstance.action.expiryTime);
                setGameStatus(actionInstance.action.status);
                fetchUserDetails([context.userId]);
                setProgressStatus({ settingInstance: ProgressState.Completed });

                setProgressStatus({ myScoreDataInstance: ProgressState.InProgress });
                let myDataRows = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId, actionContext.context.userId);
                if(myDataRows.success){
                    fetchMyScore(myDataRows.dataRows);
                    setProgressStatus({ myScoreDataInstance: ProgressState.Completed });
                }
                else
                {
                    setProgressStatus({ myScoreDataInstance: ProgressState.Failed });
                }

                setProgressStatus({ leaderboardDatAInstance: ProgressState.InProgress });
                let leaderBoardDataRows = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId);
                if(leaderBoardDataRows.success){
                    fetchLeaderBoard(leaderBoardDataRows.dataRows);
                    setProgressStatus({ leaderboardDatAInstance: ProgressState.Completed });
                }else
                {
                    setProgressStatus({ leaderboardDatAInstance: ProgressState.Failed });
                }
                setLeaderboardVisibilityFlag();
                setProgressStatus({ currentContext: ProgressState.Completed });
            }
            else
            {
                setProgressStatus({ actionInstance: ProgressState.Failed });
                setProgressStatus({ localizationInstance: ProgressState.Failed });
            }
        } else {
            setProgressStatus({ currentContext: ProgressState.Failed });
        }
    }
});

