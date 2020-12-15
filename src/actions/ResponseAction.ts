// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ResponseProgressStatus } from "../store/ResponseStore";

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
    setShouldPlayerPlay = "setShouldPlayerPlay"
}

export let initialize = action(GameResponseAction.initialize);

export let setContext = action(
    GameResponseAction.setContext,
    (context: actionSDK.ActionSdkContext) => ({ context: context })
);

export let setActionInstance = action(
    GameResponseAction.setActionInstance, (actionInstance: actionSDK.Action) => ({
        actionInstance: actionInstance
    }));

export let setShouldPlayerPlay = action(GameResponseAction.setShouldPlayerPlay);
export let setPreviousScore = action(GameResponseAction.setPreviousScore);

export let fetchActionInstanceRowsForCurrentUser = action(
    GameResponseAction.fetchActionInstanceRowsForCurrentUser, (actionInstanceRow: actionSDK.ActionDataRow[]) => ({
        actionInstanceRow: actionInstanceRow
    }));

export let shouldValidateUI = action(
    GameResponseAction.shouldValidateUI,
    (shouldValidate: boolean) => ({ shouldValidate: shouldValidate })
);

export let setSendingFlag = action(
    GameResponseAction.setSendingFlag,
    (value: boolean) => ({ value: value })
);

export let setProgressState = action(GameResponseAction.setProgressState, (status: Partial<ResponseProgressStatus>) => ({
    status: status
}));

export let setIsActionDeleted = action(
    GameResponseAction.setIsActionDeleted,
    (value: boolean) => ({ value: value })
);