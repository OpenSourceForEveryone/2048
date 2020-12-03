import { action } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "../utils/SharedEnum";

export enum GameUpdationAction {
    initialize = "initialize",
    setContext = "setContext",
    updateActionInstance = "updateActionInstance",
    fetchActionInstance = "fetchActionInstance",
    fetchActionInstanceRows = "fetchActionInstanceRows",
    shouldValidateUI = "shouldValidateUI",
    fetchActionInstanceRowsUserDetails = "fetchActionInstanceRowsUserDetails",
    setSendingFlag = "setSendingFlag",
    setProgressState = "setProgressState",
    setIsActionDeleted = "setIsActionDeleted",
    setIsUserAllowedForMultipleTimePlay = "setIsUserAllowedForMultipleTimePlay",
    addScore = "addScore",
    setPlayerPrevScore = "setPlayerPrevScore",
}

export let initialize = action(GameUpdationAction.initialize);

export let setContext = action(
    GameUpdationAction.setContext,
    (context: actionSDK.ActionSdkContext) => ({ context: context })
);

export let fetchActionInstance = action(
    GameUpdationAction.fetchActionInstance
);

export let addScore = action(
    GameUpdationAction.addScore, (actionDataRow: actionSDK.ActionDataRow) => ({
    actionDataRow: actionDataRow
}))

export let setPlayerPrevScore = action(GameUpdationAction.setPlayerPrevScore, (prevScore: string) => ({
    prevScore: prevScore
}))

export let setIsUserAllowedForMultipleTimePlay = action(
    GameUpdationAction.setIsUserAllowedForMultipleTimePlay
);

export let fetchActionInstanceRows = action(
    GameUpdationAction.fetchActionInstanceRows
);

export let updateActionInstance = action(
    GameUpdationAction.updateActionInstance
);

export let fetchActionInstanceRowsUserDetails = action(
    GameUpdationAction.fetchActionInstanceRowsUserDetails,
    (userIds: string[]) => ({ userIds: userIds })
);

export let setSendingFlag = action(
    GameUpdationAction.setSendingFlag,
    (value: boolean) => ({ value: value })
);

export let setProgressState = action(GameUpdationAction.setProgressState, (state: ProgressState) => ({
    state: state
}));

export let setIsActionDeleted = action(
    GameUpdationAction.setIsActionDeleted,
    (value: boolean) => ({ value: value })
);

export let shouldValidateUI = action(
    GameUpdationAction.shouldValidateUI,
    (shouldValidate: boolean) => ({ shouldValidate: shouldValidate })
);