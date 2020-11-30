// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import getStore, { ViewType } from "../../store/SummaryStore";
import "./game.scss";
import {
    Flex, Dialog, Loader, Text, Avatar, ButtonProps, BanIcon, TrashCanIcon, CalendarIcon, MoreIcon, SplitButton, Divider, Table, Card, AcceptIcon
} from "@fluentui/react-northstar";
import * as html2canvas from "html2canvas";
import { Utils } from "../../utils/Utils";
import { Localizer } from "../../utils/Localizer";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "../../utils/SharedEnum";
import { ShimmerContainer } from "../ShimmerLoader";
import { IBarChartItem, BarChartComponent } from "../BarChartComponent";
import { ErrorView } from "../ErrorView";
import { UxUtils } from "../../utils/UxUtils";
import { AdaptiveMenuItem, AdaptiveMenuRenderStyle, AdaptiveMenu } from "../Menu";
import { Constants } from "../../utils/Constants";
import { DateTimePickerView } from "../DateTime";
import { slice, concat } from 'lodash';
import { useEvent, getColors } from "./Util"
import cloneDeep from "lodash.clonedeep";
import Swipe from "react-easy-swipe";
import CongratulationView from "./CongrtulationView";

/**
 * <SummaryView> component that will render the main page with participation details
 */

export default class GameView extends React.Component<any, any> {
    private bodyContainer: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.bodyContainer = React.createRef();
        this.state = {
            isGameOver: false
        };
    }
    componentDidMount() {
        this.setState({

        });
    }

    render() {
        return (
            <Flex
                column
                className="body-container"
                ref={this.bodyContainer}
                id="bodyContainer"
            >
                {this.state.isGameOver ?
                    <CongratulationView /> :
                    <GameApp />
                }
            </Flex>
        );
    }
}


export const GameApp = () => {

    const UP_ARROW = 38;
    const DOWN_ARROW = 40;
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;

    const [grid, setGrid] = React.useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]);

    const [score, setScore] = React.useState(0);
    const [gameOver, setGameOver] = React.useState(false);

    // Initialize
    const initialize = () => {

        let newGrid = cloneDeep(grid);
        addNumber(newGrid);
        addNumber(newGrid);
        setGrid(newGrid);
    };

    // AddNumber - Add an item
    const addNumber = (newGrid: number[][]) => {
        let added = false;
        let gridFull = false;
        let attempts = 0;
        while (!added) {
            if (gridFull) {
                break;
            }

            let rand1 = Math.floor(Math.random() * 4);
            let rand2 = Math.floor(Math.random() * 4);
            attempts++;
            if (newGrid[rand1][rand2] === 0) {
                newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
                added = true;
            }
            if (attempts > 50) {
                gridFull = true;
                let gameOverr = checkIfGameOver();
                if (gameOverr) {
                    alert("game over");
                }
            }
        }
    };
    // Swipe Left
    const swipeLeft = (dummy: boolean) => {
        console.log("swipe left");
        let oldGrid = grid;
        let newArray = cloneDeep(grid);

        for (let i = 0; i < 4; i++) {
            let b = newArray[i];
            let slow = 0;
            let fast = 1;
            while (slow < 4) {
                if (fast === 4) {
                    fast = slow + 1;
                    slow++;
                    continue;
                }

                if (b[slow] === 0 && b[fast] === 0) {
                    fast++;
                }
                else if (b[slow] === 0 && b[fast] !== 0) {
                    b[slow] = b[fast];
                    b[fast] = 0;
                    fast++;
                }
                else if (b[slow] !== 0 && b[fast] === 0) {
                    fast++;
                }
                else if (b[slow] !== 0 && b[fast] !== 0) {
                    if (b[slow] === b[fast]) {
                        b[slow] = b[slow] + b[fast];
                        setScore(score + b[slow]) // keep track of score
                        b[fast] = 0;
                        fast = slow + 1;
                        slow++;
                    }
                    else {
                        slow++;
                        fast = slow + 1;
                    }
                }
            }
        }

        if (JSON.stringify(oldGrid) !== JSON.stringify(newArray)) {
            addNumber(newArray);
        }
        if (dummy) {
            return newArray;
        } else {
            setGrid(newArray);
        }
    };

    const swipeRight = (dummy: boolean) => {
        let oldgrid = grid;
        let newArray = cloneDeep(grid);

        for (let i = 3; i >= 0; i--) {
            let b = newArray[i];
            let slow = b.length - 1;
            let fast = slow - 1;
            while (slow > 0) {
                if (fast === -1) {
                    fast = slow - 1;
                    slow--;
                    continue;
                }
                if (b[slow] === 0 && b[fast] === 0) {
                    fast--;
                } else if (b[slow] === 0 && b[fast] !== 0) {
                    b[slow] = b[fast];
                    b[fast] = 0;
                    fast--;
                } else if (b[slow] !== 0 && b[fast] === 0) {
                    fast--;
                } else if (b[slow] !== 0 && b[fast] !== 0) {
                    if (b[slow] === b[fast]) {
                        b[slow] = b[slow] + b[fast];
                        setScore(score + b[slow]) // keep track of score
                        b[fast] = 0;
                        fast = slow - 1;
                        slow--;
                    } else {
                        slow--;
                        fast = slow - 1;
                    }
                }
            }
        }
        if (JSON.stringify(newArray) !== JSON.stringify(oldgrid)) {
            addNumber(newArray);
        }
        if (dummy) {
            return newArray;
        } else {
            setGrid(newArray);
        }
    };

    const swipeDown = (dummy: boolean) => {
        let b = cloneDeep(grid);
        let oldgrid = JSON.parse(JSON.stringify(grid));
        for (let i = 3; i >= 0; i--) {
            let slow = b.length - 1;
            let fast = slow - 1;
            while (slow > 0) {
                if (fast === -1) {
                    fast = slow - 1;
                    slow--;
                    continue;
                }
                if (b[slow][i] === 0 && b[fast][i] === 0) {
                    fast--;
                } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
                    b[slow][i] = b[fast][i];
                    b[fast][i] = 0;
                    fast--;
                } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
                    fast--;
                } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
                    if (b[slow][i] === b[fast][i]) {
                        b[slow][i] = b[slow][i] + b[fast][i];
                        setScore(score + b[slow][i]) // keep track of score
                        b[fast][i] = 0;
                        fast = slow - 1;
                        slow--;
                    } else {
                        slow--;
                        fast = slow - 1;
                    }
                }
            }
        }
        if (JSON.stringify(b) !== JSON.stringify(oldgrid)) {
            addNumber(b);
        }
        if (dummy) {
            return b;
        } else {
            setGrid(b);
        }
    };

    const swipeUp = (dummy: boolean) => {
        let b = cloneDeep(grid);
        let oldgrid = JSON.parse(JSON.stringify(grid));
        for (let i = 0; i < 4; i++) {
            let slow = 0;
            let fast = 1;
            while (slow < 4) {
                if (fast === 4) {
                    fast = slow + 1;
                    slow++;
                    continue;
                }
                if (b[slow][i] === 0 && b[fast][i] === 0) {
                    fast++;
                } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
                    b[slow][i] = b[fast][i];
                    b[fast][i] = 0;
                    fast++;
                } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
                    fast++;
                } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
                    if (b[slow][i] === b[fast][i]) {
                        b[slow][i] = b[slow][i] + b[fast][i];
                        setScore(score + b[slow][i]) // keep track of score
                        b[fast][i] = 0;
                        fast = slow + 1;
                        slow++;
                    } else {
                        slow++;
                        fast = slow + 1;
                    }
                }
            }
        }
        if (JSON.stringify(oldgrid) !== JSON.stringify(b)) {
            addNumber(b);
        }
        if (dummy) {
            return b;
        } else {
            setGrid(b);
        }
    };

    // Check Gameover
    const checkIfGameOver = () => {
        let checker = swipeLeft(true);
        if (JSON.stringify(grid) !== JSON.stringify(checker)) {
            return false;
        }

        let checker2 = swipeDown(true);
        if (JSON.stringify(grid) !== JSON.stringify(checker2)) {
            return false;
        }

        let checker3 = swipeRight(true);
        if (JSON.stringify(grid) !== JSON.stringify(checker3)) {
            return false;
        }

        let checker4 = swipeUp(true);
        if (JSON.stringify(grid) !== JSON.stringify(checker4)) {
            return false;
        }

        return true;
    };
    // Reset
    const resetGame = () => {
        setGameOver(false);
        const emptyGrid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        addNumber(emptyGrid);
        addNumber(emptyGrid);
        setGrid(emptyGrid);
        setScore(0);
    };

    const handleKeyDown = (event: any) => {
        if (gameOver) {
            return;
        }
        switch (event.keyCode) {
            case UP_ARROW:
                swipeUp(false);
                break;
            case DOWN_ARROW:
                swipeDown(false);
                break;
            case LEFT_ARROW:
                swipeLeft(false);
                break;
            case RIGHT_ARROW:
                swipeRight(false);
                break;
            default:
                break;
        }
        let gameOverr = checkIfGameOver();
        if (gameOverr) {
            setGameOver(true);
        }
    };

    const renderGame = () => {
        return (
            <div
                style={{
                    width: '80%',
                    margin: "auto",
                    marginTop: 10,
                }}
            >
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            flex: 1,
                            marginTop: "auto",
                        }}
                    >
                        <div className="gameScore">
                            Score: {score}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        background: "white",
                        width: "max-content",
                        height: "max-content",
                        margin: "auto",
                        padding: 5,
                        marginTop: 10,
                        position: "relative",
                    }}
                >
                    <Swipe innerRef={() => null}
                        onSwipeDown={() => swipeDown(false)}
                        onSwipeLeft={() => swipeLeft(false)}
                        onSwipeRight={() => swipeRight(false)}
                        onSwipeUp={() => swipeUp(false)}
                        style={{ overflowY: "hidden" }}
                    >
                        {grid.map((row, oneIndex) => {
                            return (
                                <div style={{ display: "flex" }} key={oneIndex}>
                                    {row.map((digit, index) => (
                                        Block(digit, index)
                                    ))}
                                </div>
                            );
                        })}
                    </Swipe>
                </div>
            </div>
        );
    }

    React.useEffect(() => {
        initialize();
    }, []);

    // This is a custom function
    useEvent("keydown", handleKeyDown);

    return (
        <>
            {
            gameOver
                ?
                <CongratulationView gameScore={score} />
                :
                <div className="App">
                    { renderGame() }
                </div>
            }
        </>

    );

}

export const Block = (num: number, key: any) => {
    const { blockStyle } = style;
    return (
        <div
            style={{
                ...blockStyle,
                background: getColors(num),
                color: num === 2 || num === 4 ? "#645B52" : "#F7F4EF",
            }}
            key={key}
        >
            {num !== 0 ? num : ""}
        </div>
    );
};

const style = {
    blockStyle: {
        height: 80,
        width: 80,
        margin: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 40,
        fontWeight: 480,
        color: "black",
        borderRadius: 10,
        boxShadow: '2px 3px lightgray'
    },
};
