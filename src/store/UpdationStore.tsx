import { createStore } from "satcheljs";
import "../mutator/UpdateMutator";
import "../orchestrators/UpdateOrchestrator";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "../utils/SharedEnum";

/**
 * Updation store containing all data required when user play the game.
 */

interface IGameUpdationStore {
    context: actionSDK.ActionSdkContext;
    actionInstance: actionSDK.Action;
    actionInstanceRowsForCurrentUser: actionSDK.ActionDataRow[];
    shouldValidate: boolean;
    progressState: ProgressState;
    isActionDeleted: boolean;
    shouldPlayerPlay: boolean;
    playerPrevScore: string;
    PlayerCurrentScore: string;
}

const store: IGameUpdationStore = {
    context: null,
    shouldValidate: false,
    actionInstance: null,
    actionInstanceRowsForCurrentUser: null,
    progressState: ProgressState.NotStarted,
    isActionDeleted: false,
    shouldPlayerPlay: true,
    playerPrevScore: null,
    PlayerCurrentScore: null

};

export default createStore<IGameUpdationStore>("updationStore", store);