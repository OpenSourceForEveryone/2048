// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button, Text, Loader } from "@fluentui/react-northstar";
import "./GamePage.scss";
import { Localizer } from "../../utils/Localizer";
import { Constants } from "../../utils/Constants";
import { addScore } from "../../actions/ResponseAction";
import getStore, { GameStatus } from "../../store/GamePlayStore";
import { setGameStatus } from "../../actions/GamePlayAction";

interface IGameEndProps {
    onlyOneAttempt:boolean
    score: number
}

/**
 * <GameEndView> component for game end view
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class GameEndView extends React.Component<IGameEndProps> {

    constructor(props) {
        super(props);
    }
    state = { isImageLoaded: false };
    render() {
        return (
            <>
                <div className="wining-outer">
                    <div className="table-cell">
                        {this.state.isImageLoaded ? null :
                            <Loader />
                        }
                        <img src={Constants.CONGRATULATION_IMAGE_PATH} width="180" id="congratulationImage"
                            onLoad={() => this.setState({ isImageLoaded: true })}
                        />
                        {
                            this.state.isImageLoaded &&
                            <>
                                <h4>
                                    {Localizer.getString("YourScoreOnCongratulationPage") + this.props.score}
                                </h4>

                                { this.props.onlyOneAttempt && <Text content={Localizer.getString("OnlyOneAttemptError")}
                                    className="alert-danger" />
                                }
                            </>
                        }
                    </div>
                </div>
                { !this.props.onlyOneAttempt && this.renderFooterSection()}
            </>
        );
    }

    // render the footer section of the congratualtion view
    renderFooterSection(isMobileView?: boolean) {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        content={Localizer.getString("SubmitScore")}
                        onClick={() => {
                            addScore(getStore().gameScore.toString());
                            setGameStatus(GameStatus.End)
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }
}