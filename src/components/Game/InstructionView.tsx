import * as React from "react";
import { observer } from "mobx-react";
import { Avatar, Card, Flex, Text, Divider, Checkbox, FlexItem, Button } from '@fluentui/react-northstar';
import "./game.scss";
import getStore from "./../../store/UpdationStore";
import {UxUtils} from "../../utils/UxUtils"
import { Localizer } from "../../utils/Localizer";
import Game from "./2048/Game";

@observer
export default class InstructionView extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            startGame: false,
        };
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    onButtonClick() {
        this.setState({
            startGame: true
        })
    }
    
    render() {
        return (
            this.state.startGame ?
                <Game /> :
                <Flex className="body-container instruction" column gap="gap.medium">
                    {this.renderInstruction()}
                    {this.renderFooterSection()}
                </Flex>
        )
    }

    renderInstruction(isMobileView?: boolean): JSX.Element {
        return (
            <div>
                <Card aria-roledescription="card avatar" fluid style={{backgroundColor:'rgb(250, 249, 248)'}}>
                    <Card.Header fitted>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Avatar image="https://www.webcraft.co.in/teams-ic/2048/AppIcon.png" label="2048" name="Evie yundt" size="larger" />
                            </Flex>
                            <Flex column>
                                <Text content="How To Play" weight="bold" size="large" />
                                <Text content="Use arrow key to move the tiles. Attaching two tiles with the same number will merge them into one!" styles={{ paddingTop: "4px" }} />
                            </Flex>
                        </Flex>
                    </Card.Header>
                </Card>
                <Checkbox label="Don't show me the game instruction again." className="checklist-checkbox" styles={{ padding: "16px" }} 
                onChange = {
                    () => {
                        UxUtils.setLocaStorge()
                    }
                }/>
            </div>
        );
    }

    renderFooterSection(isMobileView?: boolean): JSX.Element {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        content="Next"
                        onClick={() => {
                           this.onButtonClick();
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }

    getInstructionContent(): string 
    {
        if(UxUtils.renderingForMobile())
        {
            return Localizer.getString("HowToPlayForMobile");
        }
        else
        {
            return Localizer.getString("HowToPlayForDesktop");
        }
    }
}