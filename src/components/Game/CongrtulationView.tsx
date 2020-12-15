// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button, Text } from "@fluentui/react-northstar";
import "./game.scss";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import { Localizer } from "../../utils/Localizer";
import { Constants } from "../../utils/Constants";

/**
 * <CongratulationView> component for congratulation view
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */

@observer
export default class CongratulationView extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className="wining-outer">
                    <div className="table-cell">
                        <img src={Constants.GAME_CONGRATULATION_IMAGE_PATH} width="180" />
                        <h4>{Localizer.getString("YourScoreOnCongratulationPage") + this.props.gameScore}</h4>
                        {this.props.shouldShowAlert === "true" &&
                            <Text content={Localizer.getString("OnlyOneAttemptError")} className="alert-danger" />}
                    </div>
                </div>
                {this.props.shouldShowAlert != "true" && this.renderFooterSection()}
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
                        content= {Localizer.getString("SubmitScore")}
                        onClick={() => {
                            ActionSdkHelper.addScore(this.props.gameScore);
                            ActionSdkHelper.closeView();
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }
}