import { observer } from "mobx-react";
import * as React from "react";
import getStore, { LeaderBoard } from "../../store/SummaryStore";
import "./summary.scss";
import {
    List
} from "@fluentui/react-northstar";

@observer
export class LeaderBoardView extends React.PureComponent<any, any> {
    private scores: LeaderBoard[];
    constructor(props) {
        super(props);
        this.scores = getStore().leaderBoard;
        this.state = {
            visible: 3
        };
        this.showMore = this.showMore.bind(this);
        this.showLess = this.showLess.bind(this);
    }

    private showMore() {
        this.setState((prev) => {
            return { visible: prev.visible + 3 };
        });
    }

    private showLess() {
        this.setState(() => {
            return { visible: 3 }
        })
    }
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
    render() {
        return (
            <>
                {this.scores && this.scores.length ?
                    <>
                        <List
                            items={this.getListItems().slice(0, this.state.visible)}
                            aria-label="Static headless table"
                            className="table-container"
                            styles={{ backgroundColor: '#FAF9F8' }} />
                        {
                            this.scores.length > 3 && this.scores.length > this.state.visible ? 
                            <span className="link leaderboard-link" onClick={this.showMore}>+ Load more...</span>
                            :
                            <div> </div>
                        }
                    </> :
                    <div className="content">
                        <label>
                            {this.props.NoOneHasResponded}
                        </label>
                    </div>
                }
            </>
        )
    }
}


