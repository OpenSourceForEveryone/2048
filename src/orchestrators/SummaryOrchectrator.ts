// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toJS } from "mobx";
import { Logger } from "./../utils/Logger";
import { Constants } from "../utils/Constants";
import { Localizer } from "../utils/Localizer";
import {
    initialize, setProgressStatus, setContext, fetchLocalization, fetchUserDetails, fetchActionInstance, fetchActionInstanceSummary,
    fetchMyResponse, fetchMemberCount, setIsActionDeleted, updateMyRow, updateActionInstance, fetchActionInstanceRows, updateMemberCount,
    updateActionInstanceSummary, addActionInstanceRows, updateContinuationToken, updateNonResponders, fetchNonReponders,
    updateDueDate, updateUserProfileInfo, fetchScore, fetchLeaderBoard, setGameTitle, setGameStatus, setLeaderboardFlag
} from "../actions/SummaryActions";
import { orchestrator } from "satcheljs";
import { ProgressState } from "../utils/SharedEnum";
import getStore from "../store/SummaryStore";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";

/**
 * Summary view orchestrators to fetch data for current action, perform any action on that data and dispatch further actions to modify stores
 */

const handleErrorResponse = (error: actionSDK.ApiError) => {
    if (error && error.code == "404") {
        setIsActionDeleted(true);
    }
};

const handleError = (error: actionSDK.ApiError, requestType: string) => {
    handleErrorResponse(error);
    setProgressStatus({ [requestType]: ProgressState.Failed });
};

orchestrator(initialize, async () => {
    let currentContext = getStore().progressStatus.currentContext;
    if (currentContext == ProgressState.NotStarted || currentContext == ProgressState.Failed) {
        setProgressStatus({ currentContext: ProgressState.InProgress });

        let actionContext = await ActionSdkHelper.getActionContext();
        if (actionContext.success) {
            let context = actionContext.context as actionSDK.ActionSdkContext;
            setContext(context);
            fetchLocalization();
            fetchUserDetails([context.userId]);
            fetchActionInstance(true);
            fetchActionInstanceSummary(true);
            fetchMyResponse();
            fetchMemberCount();
            fetchActionInstanceRows(true);
            fetchScore();
            fetchLeaderBoard();
            setGameStatus();
            setLeaderboardFlag();
            setProgressStatus({ currentContext: ProgressState.Completed });
        } else {
            handleError(actionContext.error, "currentContext");
        }
    }
});

orchestrator(fetchLocalization, async (msg) => {
    let localizationState = getStore().progressStatus.localizationState;
    if (localizationState == ProgressState.NotStarted || localizationState == ProgressState.Failed) {
        setProgressStatus({ localizationState: ProgressState.InProgress });
        let response = await Localizer.initialize();
        response ? setProgressStatus({ localizationState: ProgressState.Completed }) :
            setProgressStatus({ localizationState: ProgressState.Failed });
    }
});

orchestrator(fetchMyResponse, async () => {
    let myActionInstanceRow = getStore().progressStatus.myActionInstanceRow;
    if (myActionInstanceRow == ProgressState.NotStarted || myActionInstanceRow == ProgressState.Failed) {
        setProgressStatus({ myActionInstanceRow: ProgressState.InProgress });
        let response = await ActionSdkHelper.getActionDataRows(getStore().context.actionId, "self", null, 1);
        if (response.success) {
            let row: actionSDK.ActionDataRow = response.dataRows[0];
            updateMyRow(row);
            setProgressStatus({ myActionInstanceRow: ProgressState.Completed });
        } else {
            handleError(response.error, "myActionInstanceRow");
        }
    }
});

orchestrator(fetchMemberCount, async (msg) => {
    let memberCount = getStore().progressStatus.memberCount;
    if (memberCount == ProgressState.NotStarted || memberCount == ProgressState.Failed) {
        setProgressStatus({ memberCount: ProgressState.InProgress });

        let response = await ActionSdkHelper.getSubscriptionMemberCount(toJS(getStore().context.subscription));
        if (response.success) {
            updateMemberCount(response.memberCount);
            setProgressStatus({ memberCount: ProgressState.Completed });
        } else {
            handleError(response.error, "memberCount");
        }
    }
});

orchestrator(fetchActionInstance, async (msg) => {
    if (getStore().progressStatus.actionInstance != ProgressState.InProgress) {
        if (msg.updateProgressState) {
            setProgressStatus({ actionInstance: ProgressState.InProgress });
        }

        let response = await ActionSdkHelper.getAction(getStore().context.actionId);
        if (response.success) {
            updateActionInstance(response.action);
            fetchScore();
            fetchLeaderBoard();
            setGameTitle(response.action.displayName);
            setGameStatus();
            setLeaderboardFlag();
            fetchActionInstanceRows(false);
            fetchLocalization();
            if (msg.updateProgressState) {
                setProgressStatus({ actionInstance: ProgressState.Completed });
            }
        } else {
            if (msg.updateProgressState) {
                setProgressStatus({ actionInstance: ProgressState.Failed });
            }
        }
    }
});

orchestrator(fetchActionInstanceSummary, async (msg) => {
    if (getStore().progressStatus.actionInstanceSummary != ProgressState.InProgress) {
        if (msg.updateProgressState) {
            setProgressStatus({ actionInstanceSummary: ProgressState.InProgress });
        }

        let response = await ActionSdkHelper.getActionDataRowsSummary(getStore().context.actionId, true);
        if (response.success) {
            updateActionInstanceSummary(response.summary);
            fetchScore();
            fetchLeaderBoard();
            setLeaderboardFlag();
            setGameStatus();
            fetchLocalization();
            if (msg.updateProgressState) {
                setProgressStatus({ actionInstanceSummary: ProgressState.Completed });
            }
        } else {
            if (msg.updateProgressState) {
                setProgressStatus({ actionInstanceSummary: ProgressState.Failed });
            }
        }
    }
});

orchestrator(fetchUserDetails, async (msg) => {
    let userIds: string[] = [];

    // fetch only those user profiles that are not present in the store
    for (let userId of msg.userIds) {
        if (!getStore().userProfile.hasOwnProperty(userId) || !getStore().userProfile[userId].displayName) {
            userIds.push(userId);
        }
    }
    if (userIds.length > 0) {
        let response = await ActionSdkHelper.getSubscriptionMembers(toJS(getStore().context.subscription), userIds);

        if (response.success && response.members) {
            let users: {
                [key: string]: actionSDK.SubscriptionMember;
            } = {};
            response.members.forEach(member => {
                users[member.id] = {
                    id: member.id,
                    displayName: member.displayName
                };
            });
            updateUserProfileInfo(users);
            if (response.memberIdsNotFound) {
                setDefaultUserDetails(response.memberIdsNotFound);
            }
        } else if (!response.success) {
            handleErrorResponse(response.error);
            setDefaultUserDetails(userIds);
        }
    }

    function setDefaultUserDetails(userIds) {
        let userProfile: { [key: string]: actionSDK.SubscriptionMember } = {};
        for (let userId of userIds) {
            userProfile[userId] = {
                id: userId,
                displayName: null
            };
        }
        updateUserProfileInfo(userProfile);
    }
});

orchestrator(fetchActionInstanceRows, async (msg) => {
    let actionInstance = getStore().actionInstance;
    let dataTables = actionInstance && actionInstance.dataTables;
    if (actionInstance && (dataTables[0].rowsVisibility == actionSDK.Visibility.All ||
        (dataTables[0].rowsVisibility == actionSDK.Visibility.Sender && actionInstance.creatorId == getStore().context.userId))) {

        let actionInstanceRow = getStore().progressStatus.actionInstanceRow;
        if ([ProgressState.Partial, ProgressState.Failed, ProgressState.NotStarted].indexOf(actionInstanceRow) > -1) {
            setProgressStatus({ actionInstanceRow: ProgressState.InProgress });

            let response = await ActionSdkHelper.getActionDataRows(getStore().context.actionId, null, getStore().continuationToken, 30);

            if (response.success) {
                let rows: actionSDK.ActionDataRow[] = [];
                let userIds: string[] = [];
                for (let row of response.dataRows) {
                    rows.push(row);
                    userIds.push(row.creatorId);
                }

                addActionInstanceRows(rows);
                fetchScore();
                fetchLeaderBoard();
                setGameStatus();
                setLeaderboardFlag();
                fetchLocalization();
                if (msg.shouldFetchUserDetails) {
                    fetchUserDetails(userIds);
                }

                if (response.continuationToken) {
                    updateContinuationToken(response.continuationToken);
                    setProgressStatus({ actionInstanceRow: ProgressState.Partial });
                } else {
                    setProgressStatus({ actionInstanceRow: ProgressState.Completed });
                }
            } else {
                handleError(response.error, "actionInstanceRow");
            }
        }
    }
});

orchestrator(fetchNonReponders, async () => {
    let nonResponder = getStore().progressStatus.nonResponder;
    if (nonResponder == ProgressState.NotStarted || nonResponder == ProgressState.Failed) {
        setProgressStatus({ nonResponder: ProgressState.InProgress });

        let response = await ActionSdkHelper.getNonResponders(getStore().context.actionId, getStore().context.subscription.id);

        if (response.success) {
            let userProfile: { [key: string]: actionSDK.SubscriptionMember } = {};
            response.nonParticipants = response.nonParticipants || [];
            response.nonParticipants.forEach(
                (user: actionSDK.SubscriptionMember) => {
                    userProfile[user.id] = user;
                }
            );
            updateUserProfileInfo(userProfile);
            updateNonResponders(response.nonParticipants);
            setProgressStatus({ nonResponder: ProgressState.Completed });
        } else {
            handleError(response.error, "nonResponder");
        }
    }
});

