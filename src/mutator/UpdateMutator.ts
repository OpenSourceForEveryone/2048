
import { mutator } from "satcheljs";
import {
    setContext, shouldValidateUI,
    setSendingFlag, setProgressState, setIsActionDeleted, setIsUserAllowedForMultipleTimePlay, addScore,
    setPlayerPrevScore
} from "./../actions/UpdateAction";
import * as actionSDK from "@microsoft/m365-action-sdk";
import getStore from "../store/UpdationStore";

mutator(setProgressState, (msg) => {
    const store = getStore();
    store.progressState = msg.state;
});

mutator(setContext, (msg) => {
    const store = getStore();
    let context: actionSDK.ActionSdkContext = msg.context;
    store.context = context;
});

mutator(shouldValidateUI, (msg) => {
    let shouldValidate: boolean = msg.shouldValidate;
    const store = getStore();
    store.shouldValidate = shouldValidate;
});

mutator(setIsActionDeleted, (msg) => {
    let value: boolean = msg.value;
    const store = getStore();
    store.isActionDeleted = value;
});

mutator(addScore, (msg)=>{
    const store = getStore();
    store.score = msg.actionDataRow;
});

mutator(setPlayerPrevScore, (msg) => {

    const store = getStore();
    store.playerPrevScore = msg.prevScore;
});

mutator(setIsUserAllowedForMultipleTimePlay, () => {
    const store = getStore();
    store.shouldUserPlay = getStore().actionInstance.dataTables[0].canUserAddMultipleRows;
});

