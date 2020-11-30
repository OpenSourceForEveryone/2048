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
    setProgressState(ProgressState.InProgress);
    let actionContext = await ActionSdkHelper.getActionContext();
    if (actionContext.success) {
        setContext(actionContext.context);
        let response = await Localizer.initialize();
        setProgressState(response ? ProgressState.Completed : ProgressState.Failed);
    }
});

orchestrator(addScore, async (msg) => {
    await ActionSdkHelper.addScore(msg.score)
});