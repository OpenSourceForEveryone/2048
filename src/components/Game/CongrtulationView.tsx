import * as React from "react";
import { observer } from "mobx-react";
import { Card, Flex, Image, Text, Divider, FlexItem, Button } from '@fluentui/react-northstar'
import "./game.scss";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
@observer
export default class CongratulationView extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{padding:64, paddingLeft:128}}>
                <Card aria-roledescription="card with image and text" style={{backgroundColor:'white'}}>
                    <Card.Body fitted>
                        <Flex column gap="gap.large">
                            <Image src="https://www.webcraft.co.in/teams-ic/2048/trophy.png" />
                            <Text content={"Your Score: " + this.props.gameScore} weight="bold" styles={{ textAlign: "center" }} />
                        </Flex>
                    </Card.Body>
                </Card>
                {this.renderFooterSection()}
            </div>
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