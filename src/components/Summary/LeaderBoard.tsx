// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { observer } from "mobx-react";
import * as React from "react";
import getStore, { LeaderBoard } from "../../store/SummaryStore";
import "./Summary.scss";
import { List } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { Constants } from "../../utils/Constants";

/**
 * <LeaderBoardView> component for Leaderboard on summary page
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export class LeaderBoardView extends React.PureComponent<any, any> {
    private scores: LeaderBoard[];
    constructor(props) {
        super(props);
        this.scores = getStore().leaderBoard;
        this.state = {
            visible: Constants.DEFAULT_NUMBER_OF_RECORD
        };
        this.showMore = this.showMore.bind(this);
    }
    render() {

        // preparing the leader baord
        return (
            <>
                {this.scores && this.scores.length ?
                    <>
                        <List
                            items={this.getListItems().slice(0, this.state.visible)}
                            aria-label="staticHeadlessTable"
                            className="table-container" />
                        {
                            this.scores.length > Constants.DEFAULT_NUMBER_OF_RECORD && this.scores.length > this.state.visible ?
                                <span className="link leaderboard-link" onClick={this.showMore}>+ {Localizer.getString("LoadMore")}</span>
                                :
                                <div> </div>
                        }
                    </> :
                    <div className="content">
                        <label>
                            {this.props.noOneHasResponded}
                        </label>
                    </div>
                }
            </>
        );
    }

    // Helper method to increase the row visibility count
    private showMore() {
        this.setState((prev) => {
            return { visible: prev.visible + Constants.RECORD_INCREMENT_FACTOR };
        });
    }

    // Helper method to get the list items
    private getListItems(): any[] {
        let items = [];
        if (this.scores && this.scores.length > 0) {
            this.scores.forEach(element => {
                items.push({
                    key: element.playerId,
                    header: element.playerName,
                    headerMedia: <strong>{element.score}</strong>
                });
            });
        }
        return items || [];
    }
}
