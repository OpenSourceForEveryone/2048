import { mutator } from "satcheljs";
import getStore from "../store/ResponseStore";
import {
    setContext,
    shouldValidateUI,
    setProgressState,
    setActionInstance,
    fetchActionInstanceRowsForCurrentUser,
    setGameStatus,
    updateGameBoard,
    updateGameScore,
    addItemToGameBoard,
    updateInstructionPageView
} from "../actions/ResponseAction";
import * as actionSDK from "@microsoft/m365-action-sdk";

/**
 * Update view mutators to modify store data on which update view relies
 */
mutator(setProgressState, (msg) => {
    const store = getStore();
    store.progressState = {
        ...getStore().progressState,
        ...msg.status,
    };
});

mutator(setContext, (msg) => {
    const store = getStore();
    let context: actionSDK.ActionSdkContext = msg.context;
    store.context = context;
});

mutator(setActionInstance, (msg) => {
    const store = getStore();
    store.actionInstance = msg.actionInstance;
});

mutator(fetchActionInstanceRowsForCurrentUser, (msg) => {
    const store = getStore();
    store.actionInstanceRowsForCurrentUser = msg.actionInstanceRow;
    if(store.actionInstanceRowsForCurrentUser.length > 0) {
        store.playerPrevScore = store.actionInstanceRowsForCurrentUser[0].columnValues["1"];
        const isMultiPlayAllowed = store.actionInstance.dataTables[0].canUserAddMultipleRows;
        if(isMultiPlayAllowed) {
            store.shouldPlayerPlay = true;
        } else {
            store.shouldPlayerPlay = false;
        }
    } else {
        store.shouldPlayerPlay = true;
    }
});

mutator(shouldValidateUI, (msg) => {
    const store = getStore();
    store.shouldValidate = msg.shouldValidate;
});

mutator(setGameStatus, (msg) => {
    const store = getStore();
    store.gameStatus = msg.status;
});

mutator(updateGameBoard, (msg) => {
    const store = getStore();
    store.gameGridData = msg.board;
});

mutator(updateGameScore, (msg) => {
    const store = getStore();
    store.gameScore = msg.score;
});

mutator(addItemToGameBoard, (msg) => {
    const store = getStore();
    const grid = store.gameGridData;
    grid[msg.row][msg.column] = msg.value;
    store.gameGridData = grid;
});

mutator(updateInstructionPageView, () => {
    const store = getStore();
    store.isGameInstructionPageVisible = !store.isGameInstructionPageVisible;
});
