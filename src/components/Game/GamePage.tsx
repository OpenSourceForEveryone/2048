// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore from "./../../store/UpdationStore";
import "./game.scss";
import { Localizer } from "../../utils/Localizer";
import { ErrorView } from "../ErrorView";
import { ProgressState } from "./../../utils/SharedEnum";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import InstructionView from "./InstructionView";
import { UxUtils } from "../../utils/UxUtils";
import { Loader } from "@fluentui/react-northstar";
import Game from "./2048/Game"
/**
 * 
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class GamePage extends React.Component<any, any> {
    render() {
        let hostContext: actionSDK.ActionSdkContext = getStore().context;
        console.log("Host context --" + hostContext);
        
        if (hostContext) {
            ActionSdkHelper.hideLoadingIndicator();
        } else {
            if (getStore().progressState == ProgressState.NotStarted || getStore().progressState == ProgressState.InProgress) {
                return <Loader />;
            }
        }

        if (getStore().isActionDeleted) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GameDeletedError")}
                    subtitle={Localizer.getString("ChecklistDeletedErrorDescription")}
                    buttonTitle={Localizer.getString("Close")}
                    image={"./images/actionDeletedError.png"}
                />
            );
        }

        if (getStore().progressState == ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GameError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        }

        if (getStore().progressState == ProgressState.Completed) {
            ActionSdkHelper.hideLoadingIndicator();
        }

        if (UxUtils.shouldShowInstructionPage()) {
            return this.getInstructionPage();
        }
        else {
            return this.getGamePage();
        }
    }
    /**
     * Method to return the view based on the user selection
     */
    private getGamePage(): JSX.Element {
        return <Game />;
    }
    private getInstructionPage(): JSX.Element {
        return <InstructionView />
    }
}
