import * as React from "react";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button } from '@fluentui/react-northstar'
import "./game.scss";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
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
                        <img src="https://www.webcraft.co.in/teams-ic/2048/trophy.png" width="180" />
                        <h4>{"Your Score: " + this.props.gameScore}</h4>
                    </div>
                </div>
                {this.renderFooterSection()}
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