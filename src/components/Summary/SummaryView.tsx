// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore, { ViewType } from "./../../store/SummaryStore";
import "./summary.scss";
import { Flex, Text,  Card } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { MyScoreBoard } from "./MyScoreBoard";
import { LeaderBoardView } from "./LeaderBoard";
import { UxUtils } from "../../utils/UxUtils";

/**
 * <SummaryView> component that will render the main page with score details
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
                    className="body-container no-mobile-footer no-top-padding summaryview"
                    ref={this.bodyContainer}
                    id="bodyContainer"
                    tabIndex={0}
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
                <MyScoreBoard YouHaveNotResponded = {Localizer.getString("YouHaveNotResponded")}/>
            </>
        );
    }
    private getLeaderBoard(): JSX.Element {
        return (
            getStore().isLeaderBoardVisible ? 
            <Flex className="settings-item-margin" role="group" aria-label="Leaderboard" column gap="gap.smaller">
                <label className="settings-item-title" style={{ paddingTop: '16px', display:'block', paddingBottom:'0px !important' }}>{Localizer.getString("LeaderboardInSummaryView")}</label>
                <LeaderBoardView NoOneHasResponded = {Localizer.getString("NoOneHasResponded")} />
            </Flex>: <div></div>
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
                        {this.gameDueDateString()}
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
    
    private gameDueDateString():  JSX.Element {
        const date = new Date(getStore().dueDate);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        const local = getStore().local;
        if(!getStore().isGameExpired){
            return (
                <Text content={"The Game is active till " + UxUtils.formatDate(date, local, options)} size="medium" />
            );
        }
        else
        {
            return (
                <Text content={"Game Expired..."} size="medium" style={{color:"#C4314B"}} />
            );
        }
    }
}