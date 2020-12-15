import { orchestrator } from "satcheljs";
import {
    initialize,
    setContext,
    setActionInstance,
    fetchActionInstanceRowsForCurrentUser,
    setProgressState,
} from "../actions/ResponseAction";
import { Localizer } from "../utils/Localizer";
import { ProgressState } from "../utils/SharedEnum";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";

orchestrator(initialize, async () => {
    setProgressState({ currentContext: ProgressState.InProgress });
    setProgressState({ settingInstance: ProgressState.InProgress });
    let actionContext = await ActionSdkHelper.getActionContext();
    if (actionContext.success) {
        setContext(actionContext.context);
        setProgressState({ currentContext: ProgressState.Completed });

        setProgressState({ actionInstance: ProgressState.InProgress });
        setProgressState({ localizationInstance: ProgressState.InProgress });
        let actionInstance = await ActionSdkHelper.getAction(actionContext.context.actionId);
        let localizer = await Localizer.initialize();
        if (localizer && actionInstance.success) {
            setProgressState({ localizationInstance: ProgressState.Completed });

            setActionInstance(actionInstance.action);
            setProgressState({ actionInstance: ProgressState.Completed });

            setProgressState({ currentUserDataInstance: ProgressState.InProgress });
            const dataRow = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId, actionContext.context.userId);
            if(dataRow.success) {

                fetchActionInstanceRowsForCurrentUser(dataRow.dataRows);
                setProgressState({ currentUserDataInstance: ProgressState.Completed });

            } else {
                setProgressState({ currentUserDataInstance: ProgressState.Failed });
            }
        } else {
            setProgressState({ localizationInstance: ProgressState.Failed });
            setProgressState({ currentContext: ProgressState.Failed });
        }
    } else {
        setProgressState({ currentContext: ProgressState.Failed });
    }
    setProgressState({ settingInstance: ProgressState.Completed });
});
