// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore from "./../../store/SummaryStore";
import "./summary.scss";
import SummaryView from "./SummaryView";
import { Localizer } from "../../utils/Localizer";
import { ErrorView } from "../ErrorView";
import { ProgressState } from "./../../utils/SharedEnum";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";

/**
 * <SummaryPage> component to render data for summary page
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class SummaryPage extends React.Component<any, any> {
    render() {
        let progressStatus = getStore().progressStatus;

        if (progressStatus.actionInstance == ProgressState.InProgress ||
            progressStatus.currentContext == ProgressState.InProgress ||
            progressStatus.localizationInstance == ProgressState.InProgress ||
            progressStatus.myScoreDataInstance == ProgressState.InProgress ||
            progressStatus.leaderboardDataAInstance == ProgressState.InProgress ||
            progressStatus.settingInstance == ProgressState.InProgress) {
            return  <div />;
        } else if (progressStatus.actionInstance == ProgressState.Failed || progressStatus.currentContext == ProgressState.Failed ||
            progressStatus.localizationInstance == ProgressState.Failed || progressStatus.myScoreDataInstance == ProgressState.Failed ||
            progressStatus.leaderboardDataAInstance == ProgressState.Failed || progressStatus.settingInstance == ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GenericError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        } else {
            ActionSdkHelper.hideLoadingIndicator();
            return this.getView();
        }
    }
    /**
     * Method to return the view based on the user selection
     */
    private getView(): JSX.Element {
        return <SummaryView />;
    }
}
