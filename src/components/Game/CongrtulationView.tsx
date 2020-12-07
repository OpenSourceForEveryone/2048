import * as React from "react";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button, Text } from '@fluentui/react-northstar'
import "./game.scss";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import { Localizer } from "../../utils/Localizer";
import { Constants } from "../../utils/Constants";

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
        )
    }
    renderFooterSection(isMobileView?: boolean) {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        content="Submit Score"
                        onClick={() => {
                            ActionSdkHelper.addScore(this.props.gameScore)
                            ActionSdkHelper.closeView();
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }
}