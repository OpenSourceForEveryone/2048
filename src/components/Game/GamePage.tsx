// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore, { ViewType } from "./../../store/SummaryStore";
import "./game.scss";
import { Localizer } from "../../utils/Localizer";
import { ErrorView } from "../ErrorView";
import { ProgressState } from "./../../utils/SharedEnum";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import { Flex } from "@fluentui/react-northstar";
import GameView from "./GameView"
import InstructionView from "./InstructionView";
import CongratulationView from "./CongrtulationView";
import { UxUtils } from "../../utils/UxUtils";

/**
 * <SummaryPage> component to render data for summary page
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class GamePage extends React.Component<any, any> {
    render() {
        if (getStore().isActionDeleted) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GameDeletedError")}
                    subtitle={Localizer.getString("GameDeletedErrorDescription")}
                    buttonTitle={Localizer.getString("Close")}
                    image={"./images/actionDeletedError.png"}
                />
            );
        }

        let progressStatus = getStore().progressStatus;
        if (progressStatus.actionInstance == ProgressState.Failed || progressStatus.actionInstanceSummary == ProgressState.Failed ||
            progressStatus.localizationState == ProgressState.Failed || progressStatus.memberCount == ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GenericError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        }
        ActionSdkHelper.hideLoadingIndicator();
        if(UxUtils.shouldShowInstructionPage())
        {
            return this.getInstructionPage();
        }
        else
        {
            return this.getGamePage(); 
        }
       
    }
    /**
     * Method to return the view based on the user selection
     */
    private getGamePage(): JSX.Element {
        return <GameView />;
    }

    private  getInstructionPage() : JSX.Element
    {
        return <InstructionView />
    }
}
