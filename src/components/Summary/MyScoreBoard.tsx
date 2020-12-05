import { observer } from "mobx-react";
import * as React from "react";
import getStore, { MyGameScore } from "../../store/SummaryStore";
import { Localizer } from "../../utils/Localizer";
import "./summary.scss";

@observer
export class MyScoreBoard extends React.PureComponent<any, any> {
    private scores: MyGameScore[];
    private bodyContainer: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.scores = getStore().scoreBoard;
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

    render() {
        return (
            this.scores && this.scores.length > 0 ?
                <>
                    <div className="timeline">
                        {
                            this.scores.slice(0, this.state.visible).map((score, index) => (
                                this.renderTimelineElement(score.score, score.timeStamp, index)
                            ))
                        }
                    </div>
                    {
                        this.scores.length > 3 && this.scores.length > this.state.visible ? 
                        <span className="link my-score-link" onClick={this.showMore}>+ Load more...</span>
                        :
                        <div></div>
                    }
                </>
                :
                <div className="content">
                    <label>
                    {this.props.YouHaveNotResponded}
                </label>
                </div>
        )
    }

    renderTimelineElement(score: string, timeStamp: string, index: number): JSX.Element {
        return (
            <div className="container right">
                <div className="content" key={index}>
                    <strong>{score}</strong>
                    <span className="pull-right">{timeStamp}</span>
                </div>
            </div>
        )
    }
}


