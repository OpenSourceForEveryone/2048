import { action } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ResponseProgressStatus } from "../store/UpdationStore";

export enum GameUpdationAction {
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

export let initialize = action(GameUpdationAction.initialize);

export let setContext = action(
    GameUpdationAction.setContext,
    (context: actionSDK.ActionSdkContext) => ({ context: context })
);

export let setActionInstance = action(
    GameUpdationAction.setActionInstance, (actionInstance: actionSDK.Action) => ({
        actionInstance: actionInstance
    }));

export let setShouldPlayerPlay = action(GameUpdationAction.setShouldPlayerPlay);
export let setPreviousScore = action(GameUpdationAction.setPreviousScore);

export let fetchActionInstanceRowsForCurrentUser = action(
    GameUpdationAction.fetchActionInstanceRowsForCurrentUser, (actionInstanceRow: actionSDK.ActionDataRow[]) => ({
        actionInstanceRow: actionInstanceRow
    }));

export let shouldValidateUI = action(
    GameUpdationAction.shouldValidateUI,
    (shouldValidate: boolean) => ({ shouldValidate: shouldValidate })
);

export let setSendingFlag = action(
    GameUpdationAction.setSendingFlag,
    (value: boolean) => ({ value: value })
);

export let setProgressState = action(GameUpdationAction.setProgressState, (status: Partial<ResponseProgressStatus>) => ({
    status: status
}));

export let setIsActionDeleted = action(
    GameUpdationAction.setIsActionDeleted,
    (value: boolean) => ({ value: value })
);