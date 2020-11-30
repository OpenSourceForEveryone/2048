// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Utils } from "../utils/Utils";
import { ISettingsComponentProps } from "./../components/Creation/Settings";
import { ProgressState } from "./../utils/SharedEnum";
import "./../orchestrators/CreationOrchestrator";
import "./../mutator/CreationMutator";

export enum Page {
    Main,
    Settings,
    Preview,
    UpdateQuestion
}

interface IGameCreationStore {
    context: actionSDK.ActionSdkContext;
    progressState: ProgressState;
    title: string;
    settings: ISettingsComponentProps;
    showBlankTitleError: boolean;
    shouldValidate: boolean;
    sendingAction: boolean;
    currentPage: Page
}

const store: IGameCreationStore = {
    context: null,
    title: "",
    settings: {
        resultVisibility: false,
        dueDate: Utils.getDefaultExpiry(7).getTime(),
        isMultiResponseAllowed: true,
        strings: null,
    },
    shouldValidate: false,
    showBlankTitleError: false,
    sendingAction: false,
    currentPage: Page.Settings,  // change currentPage value to switch b/w diff components
    progressState: ProgressState.NotStarted
};

export default createStore<IGameCreationStore>("cerationStore", store);
