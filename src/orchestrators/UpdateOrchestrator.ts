import { orchestrator } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";
import {
    initialize,
    setProgressState,
    addScore,
    setContext

} from "../actions/UpdateAction";
import { Localizer } from "../utils/Localizer";
import { ProgressState } from "../utils/SharedEnum";
import getStore from "../store/UpdationStore";

orchestrator(initialize, async () => {
    let actionContext = await ActionSdkHelper.getActionContext();
    setContext(actionContext.context);
});

orchestrator(addScore, async (msg) => {
    await ActionSdkHelper.addDataRow(msg.actionDataRow)
});