// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore, { MyGameScore, ViewType } from "./../../store/SummaryStore";
import "./summary.scss";
import {
    closePoll, pollCloseAlertOpen, updateDueDate, pollExpiryChangeAlertOpen, setDueDate, pollDeleteAlertOpen, deletePoll,
    setCurrentView, downloadCSV, setProgressStatus
} from "./../../actions/SummaryActions";
import {
    Flex, Dialog, Loader, Text, Avatar, ButtonProps, BanIcon, TrashCanIcon, CalendarIcon, MoreIcon, SplitButton, Divider, Table, Card, AcceptIcon, List
} from "@fluentui/react-northstar";
import * as html2canvas from "html2canvas";
import { Utils } from "../../utils/Utils";
import { Localizer } from "../../utils/Localizer";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "./../../utils/SharedEnum";
import { ShimmerContainer } from "../ShimmerLoader";
import { IBarChartItem, BarChartComponent } from "../BarChartComponent";
import { ErrorView } from "../ErrorView";
import { UxUtils } from "./../../utils/UxUtils";
import { AdaptiveMenuItem, AdaptiveMenuRenderStyle, AdaptiveMenu } from "../Menu";
import { Constants } from "./../../utils/Constants";
import { MyScoreBoard } from "./MyScoreBoard";
import { LeaderBoardView } from "./LeaderBoard";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

/**
 * <SummaryView> component that will render the main page with participation details
 */

@observer
export default class SummaryView extends React.Component<any, any> {
    private bodyContainer: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.bodyContainer = React.createRef();
    }
    render() {
        return (
            <>
                <Flex
                    column
                    className="body-container no-mobile-footer no-top-padding"
                    ref={this.bodyContainer}
                    id="bodyContainer"
                >
                    {this.getTitleContainer()}
                    {this.getMyScores()}
                    {this.getLeaderBoard()}
                </Flex>
            </>
        );
    }
    private getMyScores(): JSX.Element {
        return (
            <>
                <label className="settings-item-title" style={{ paddingBottom: '16px', display:'block' }}>{Localizer.getString("YourScoreInSummaryView")}</label>
                <MyScoreBoard />
            </>
        );
    }
    private getLeaderBoard(): JSX.Element {
        return (
            <Flex className="settings-item-margin" role="group" aria-label="Leaderboard" column gap="gap.smaller">
                <label className="settings-item-title" style={{ paddingTop: '16px', display:'block' }}>{Localizer.getString("LeaderboardInSummaryView")}</label>
                <LeaderBoardView />
            </Flex>
        );
    }
    private getTitleContainer(): JSX.Element {
        return (
            <Flex className="summary-header"
                role="group"
                aria-label="Leaderboard"
                column gap="gap.smaller"
                styles={{ backgroundColor: '#FAF9F8' }} >
                <Card aria-roledescription="card avatar" fluid style={{backgroundColor:'rgb(250, 249, 248)'}}>
                    <Card.Header fitted>
                        <Text content={this.getGameTitle()} weight="bold" />
                        <Text content={"The Game is active till " + this.gameDueDate()} size="medium" />
                    </Card.Header>
                </Card>
            </Flex>
        );
    }

    private getGameTitle() {
        const title = getStore().title;
        if (title) {
            return title;
        } else {
            return "2048 Tournament";
        }
    }
    
    private gameDueDate() {
        let dateNumber: number = getStore().dueDate;
        const minutes = new Date(dateNumber).getMinutes().toString();
        return `${new Date(dateNumber).toDateString()}
        ${new Date(dateNumber).getHours()} : ${minutes.length == 1 ? `0${minutes}` : minutes}`
    }
}