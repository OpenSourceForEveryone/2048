import { orchestrator } from "satcheljs";
import {
    initialize,
    setContext,
    setActionInstance,
    fetchActionInstanceRowsForCurrentUser,
    setProgressState,
} from "../actions/UpdateAction";
import { Localizer } from "../utils/Localizer";
import { ProgressState } from "../utils/SharedEnum";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";

orchestrator(initialize, async () => {
    let actionContext = await ActionSdkHelper.getActionContext();
    if (actionContext.success) {
        setContext(actionContext.context);
        let actionInstance = await ActionSdkHelper.getAction(actionContext.context.actionId)
        let localizer = await Localizer.initialize();
        if (localizer && actionInstance.success) {
            setActionInstance(actionInstance.action);
            setProgressState(ProgressState.InProgress);
            const dataRow = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId, actionContext.context.userId);
            if(dataRow.success){
                fetchActionInstanceRowsForCurrentUser(dataRow.dataRows);
                setProgressState(ProgressState.Completed);
            }
        } 
        else 
        {
            setProgressState(ProgressState.Failed);
        }
    } 
    else 
    {
        setProgressState(ProgressState.Failed);
    }
});




