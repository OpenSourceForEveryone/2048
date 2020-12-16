// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore from "./../../store/SummaryStore";
import "./summary.scss";
import { Localizer } from "../../utils/Localizer";
import { ErrorView } from "../ErrorView";
import { ProgressState } from "./../../utils/SharedEnum";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import { MyScoreBoard } from "./MyScoreBoard";
import { Card, Flex, Text } from "@fluentui/react-northstar";
import { LeaderBoardView } from "./LeaderBoard";
import { UxUtils } from "../../utils/UxUtils";

/**
 * <SummaryPage> component to render data for summary page
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class SummaryPage extends React.Component<any, any> {
    private bodyContainer: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.bodyContainer = React.createRef();
    }
    render() {
        let progressStatus = getStore().progressStatus;
        if (progressStatus.actionInstance == ProgressState.InProgress ||
            progressStatus.currentContext == ProgressState.InProgress ||
            progressStatus.localizationInstance == ProgressState.InProgress ||
            progressStatus.myScoreDataInstance == ProgressState.InProgress ||
            progressStatus.leaderboardDataAInstance == ProgressState.InProgress ||
            progressStatus.settingInstance == ProgressState.InProgress) {
            return <div />;
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
            return this.getsSummaryView();
        }
    }
    /**
     * Method to return the view based on the user selection
     */
    private getsSummaryView(): JSX.Element {
        return (
            <Flex
                column
                className="body-container no-mobile-footer no-top-padding summaryview"
                ref={this.bodyContainer}
                id="bodyContainer"
                tabIndex={0}
            >
                {this.getTitleContainer()}
                {this.getMyScores()}
                {this.getLeaderBoard()}
            </Flex>
        )
    };

    // Get title section of summary view
    private getTitleContainer(): JSX.Element {
        return (
            <Flex className="summary-header title-container-background-color"
                role="group"
                aria-label="Leaderboard"
                column gap="gap.smaller" >
                <Card aria-roledescription="card avatar" fluid
                    className="card-container-background-color">
                    <Card.Header fitted>
                        <Text content={this.getGameTitle()} weight="bold" />
                        {this.gameDueDateString()}
                    </Card.Header>
                </Card>
            </Flex>
        );
    }

    // Get my scores section of summary view
    private getMyScores(): JSX.Element {
        return (
            <>
                <label
                    className="settings-item-title myscore-board-padding">
                    {Localizer.getString("YourScoreInSummaryView")}
                </label>
                <MyScoreBoard
                    youHaveNotResponded={Localizer.getString("YouHaveNotResponded")} />
            </>
        );
    }

    // get leaderboard section of summary view
    private getLeaderBoard(): JSX.Element {
        return (
            getStore().isLeaderBoardVisible ?
                <Flex className="settings-item-margin"
                    role="group"
                    aria-label="Leaderboard"
                    column gap="gap.smaller">
                    <label className="settings-item-title leader-board-padding">
                        {Localizer.getString("LeaderboardInSummaryView")}
                    </label>
                    <LeaderBoardView noOneHasResponded={Localizer.getString("NoOneHasResponded")} />
                </Flex> : <div></div>
        );
    }

    // get game title
    private getGameTitle() {
        const title = getStore().title;
        if (title) {
            return title;
        } else {
            return Localizer.getString("GameDefaultString");
        }
    }

    // fetch due date string
    private gameDueDateString(): JSX.Element {
        const date = new Date(getStore().dueDate);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        const local = getStore().local;
        if (!getStore().isGameExpired) {
            return (
                <Text content={Localizer.getString("GameActiveString") + UxUtils.formatDate(date, local, options)} size="medium" />
            );
        } else {
            return (
                <Text content={Localizer.getString("GameExpired")} size="medium" className="expired-game-text-color" />
            );
        }
    }
}
