// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import { Page } from "../store/CreationStore";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { IGameCreationComponentProps } from "../components/Creation/GameCreationView";
import { ProgressState } from "./../utils/SharedEnum";

export enum GameCreationAction {

    initialize = "initialize",
    setContext = "setContext",
    updateTitle = "updateTitle",
    updateSettings = "updateSettings",
    shouldValidateUI = "shouldValidateUI",
    setSendingFlag = "setSendingFlag",
    setProgressState = "setProgressState",
    goToPage = "goToPage",
    callActionInstanceCreationAPI = "callActionInstanceCreationAPI",
    validateGameTitle = "validateGameTitle",
}

export let initialize = action(GameCreationAction.initialize);

export let callActionInstanceCreationAPI = action(GameCreationAction.callActionInstanceCreationAPI);

export let setContext = action(GameCreationAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let setSendingFlag = action(GameCreationAction.setSendingFlag);

export let goToPage = action(GameCreationAction.goToPage, (page: Page) => ({
    page: page
}));

export let updateTitle = action(GameCreationAction.updateTitle, (title: string) => ({
    title: title
}));

export let updateSettings = action(GameCreationAction.updateSettings, (settingProps: IGameCreationComponentProps) => ({
    settingProps: settingProps
}));

export let setProgressState = action(GameCreationAction.setProgressState, (state: ProgressState) => ({
    state: state
}));

export let shouldValidateUI = action(GameCreationAction.shouldValidateUI, (shouldValidate: boolean) => ({
    shouldValidate: shouldValidate
}));

export let validateGameTitle = action(GameCreationAction.validateGameTitle, (title: string) => ({
    title: title
}));