import * as React from "react";
import { observer } from "mobx-react";
import { Localizer } from "../../../utils/Localizer";
import { GameUtils } from "../GameUtils/GameUtils";
import "./GameBoard.scss";
import { Constants } from "../../../utils/Constants";

// Game props
interface GameProps {
    boardData: any[];
    gameScore: number;
    tabIndex?: number;
}
/**
 * <GameBoard> component for response view
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class GameBoard extends React.Component<GameProps> {
    constructor(props: GameProps) {
        super(props);
    }

    // Helper method to render the game header
    renderGameHeader() {
        return (
            <div className="gameScore">
                {Localizer.getString("Score")} {this.props.gameScore}
            </div>
        );
    }

    // Helper method to render the game board tile
    renderGameTile(tileNumer: number, key: number) {
        return (
            <div
                className="tile"
                style={{ background: GameUtils.getColourOfTile(tileNumer), color: tileNumer !== 0 && Constants.DEFAULT_BOARD_COLOR }}
                key={key}
            >
                {tileNumer ? tileNumer : ""}
            </div>
        );
    }

    // Helper method to render the entire game board
    renderGameBoard() {
        return (
            <div className="board__body">
                {this.props.boardData.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="board__row">
                            {row.map((num, index) => (
                                this.renderGameTile(num, index)
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <>
                {this.renderGameHeader()}
                <div className="container" tabIndex={this.props.tabIndex}>
                    {this.renderGameBoard()}
                </div>
            </>
        );
    }
}