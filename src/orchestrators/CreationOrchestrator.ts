// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setProgressState } from "./../actions/CreationActions";
import { action, toJS } from "mobx";
import { Localizer } from "../utils/Localizer";
import { orchestrator } from "satcheljs";
import { setContext, initialize, callActionInstanceCreationAPI, updateTitle, setSendingFlag, shouldValidateUI } from "../actions/CreationActions";
import { ProgressState } from "../utils/SharedEnum";
import getStore from "../store/CreationStore";
import { Utils } from "../utils/Utils";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";

/**
 * Creation view orchestrators to do API calls, perform any action on data and dispatch further actions to modify stores in case of any change
 */

function validateActionInstance(actionInstance: actionSDK.Action): boolean {
    if (actionInstance == null) { return false; }
    // let dataColumns = actionInstance.dataTables[0].dataColumns;
    // if (!dataColumns || dataColumns.length <= 0 || !dataColumns[0].displayName || dataColumns[0].displayName == "" ||
    //     !dataColumns[0].options || dataColumns[0].options.length < 2) {
    //     return false;
    // }

    // for (let option of dataColumns[0].options) {
    //     if (!option.displayName || option.displayName == "") {
    //         return false;
    //     }
    // }
    return true;
}

/**
 * Initialization of createion view fetching action context and localization details
 */
orchestrator(initialize, async () => {
    setProgressState(ProgressState.InProgress);
    let actionContext = await ActionSdkHelper.getActionContext();
    if (actionContext.success) {
        setContext(actionContext.context);
        let response = await Localizer.initialize();
        setProgressState(response ? ProgressState.Completed : ProgressState.Failed);
    }
});

orchestrator(callActionInstanceCreationAPI, async () => {
    let actionInstance: actionSDK.Action = {
        displayName: "2048 Game",
        expiryTime: getStore().settings.dueDate,
        dataTables: [
            {
                name: "game",
                dataColumns: [],
                attachments: [],
            },
        ],
    };
    updateTitle(getStore().title.trim());
    let gameSetting: actionSDK.ActionDataColumn = {
        name: "0",
        valueType: actionSDK.ActionDataColumnValueType.Text,
        displayName: getStore().title,
    };

    let gameScore: actionSDK.ActionDataColumn = {
        name: "1",
        valueType: actionSDK.ActionDataColumnValueType.Text,
        displayName: "gameScore",
    };
    let gamePlayer: actionSDK.ActionDataColumn = {
        name: "2",
        valueType: actionSDK.ActionDataColumnValueType.Text,
        displayName: "gamePlayer",
    };
    
    actionInstance.dataTables[0].dataColumns.push(gameSetting);
    actionInstance.dataTables[0].dataColumns.push(gameScore);
    actionInstance.dataTables[0].dataColumns.push(gamePlayer);
    // Set responses visibility
    actionInstance.dataTables[0].rowsVisibility = getStore().settings.resultVisibility ?
    actionSDK.Visibility.Sender : actionSDK.Visibility.All;

    actionInstance.dataTables[0].canUserAddMultipleRows = getStore().settings.isMultiResponseAllowed;

    if (validateActionInstance(actionInstance)) {
        console.log("Validated")
        setSendingFlag();
        prepareActionInstance(actionInstance, toJS(getStore().context));
        const res = await ActionSdkHelper.createActionInstance(actionInstance);
        console.log(res);
    } else {
        shouldValidateUI(true);
    }
});

function prepareActionInstance(actionInstance: actionSDK.Action, actionContext: actionSDK.ActionSdkContext) {
    if (Utils.isEmpty(actionInstance.id)) {
        actionInstance.id = Utils.generateGUID();
        actionInstance.createTime = Date.now();
    }
    actionInstance.updateTime = Date.now();
    actionInstance.creatorId = actionContext.userId;
    actionInstance.actionPackageId = actionContext.actionPackageId;
    actionInstance.version = actionInstance.version || 1;
    actionInstance.dataTables[0].canUserAddMultipleRows = actionInstance.dataTables[0].canUserAddMultipleRows || false;
    actionInstance.dataTables[0].rowsVisibility = actionInstance.dataTables[0].rowsVisibility || actionSDK.Visibility.All;

    let isPropertyExists: boolean = false;
    if (actionInstance.customProperties && actionInstance.customProperties.length > 0) {
        for (let property of actionInstance.customProperties) {
            if (property.name == "Locale") {
                isPropertyExists = true;
            }
        }
    }
    if (!isPropertyExists) {
        actionInstance.customProperties = actionInstance.customProperties || [];
        actionInstance.customProperties.push({
            name: "Locale",
            valueType: actionSDK.ActionPropertyValueType.Text,
            value: actionContext.locale,
        });
    }
}
