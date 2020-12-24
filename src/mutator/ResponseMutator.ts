import { mutator } from "satcheljs";
import getStore from "../store/ResponseStore";
import {
    setContext,
    shouldValidateUI,
    setProgressState,
    setActionInstance,
    fetchActionInstanceRowsForCurrentUser
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
        store.playerPrevScore = store.actionInstanceRowsForCurrentUser[0].columnValues["2"];
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
