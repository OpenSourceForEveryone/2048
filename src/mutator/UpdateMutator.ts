
import { mutator } from "satcheljs";
import {
    setContext, goToPage, shouldValidateUI, setProgressState, addScore
} from "./../actions/UpdateAction";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Utils } from "../utils/Utils";
import getStore from "../store/UpdationStore";

mutator(setContext, (msg) => {
    const store = getStore();
    let context: actionSDK.ActionSdkContext = msg.context;
    store.context = context;
   

});
mutator(goToPage, (msg) => {
    const store = getStore();
    store.page = msg.page;
});

mutator(addScore, (msg) => {
    const store = getStore();
    store.score = msg.score
})
