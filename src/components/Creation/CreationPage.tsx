// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { callActionInstanceCreationAPI, updateSettings } from "./../../actions/CreationActions";
import "./creation.scss";
import "./CustomSettings.scss";
import "./Settings.scss";
import getStore, { Page } from "./../../store/CreationStore";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button, Loader } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { ProgressState } from "./../../utils/SharedEnum";
import { ErrorView } from "../ErrorView";
import { UxUtils } from "./../../utils/UxUtils";
import { Settings, ISettingsComponentProps, ISettingsComponentStrings } from "./Settings";
import { Constants } from "./../../utils/Constants";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";

/**
 * <CreationPage> component for create view of game app
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class CreationPage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            showError: false
        };
    }

    isValidGameTitle() {
        const title = getStore().title;
        if (title.length < 1) {
            return false;
        }
        return true;
    }

    render() {
        let progressState = getStore().progressState;
        if (progressState === ProgressState.NotStarted || progressState === ProgressState.InProgress) {
            return <Loader />;
        } else if (progressState === ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GenericError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        } else {
            // Render View
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <>
                    <Flex gap="gap.medium" column>
                        {this.renderSettingsForGame()}
                    </Flex>
                    {this.renderFooterSection()}
                </>
            );
        }
    }
    
    renderSettingsForGame() {
        let settingsProps: ISettingsComponentProps = {
            ...this.getCommonSettingsProps(),
        };
        return <Settings {...settingsProps} />;
    }

    /**
     * Helper function to provide footer for main page
     * @param isMobileView true or false based of whether its for mobile view or not
     */
    renderFooterSection(isMobileView?: boolean) {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        loading={getStore().sendingAction}
                        disabled={getStore().sendingAction}
                        content={Localizer.getString("SendGameRequest")}
                        onClick={() => {
                            if (this.isValidGameTitle()) {
                                this.setState({
                                    showError: false
                                });
                                callActionInstanceCreationAPI();
                            } else {
                                this.setState({
                                    showError: true
                                });
                            }
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }

    /**
     * Helper method to provide strings for settings view
     */
    getStringsForSettings(): ISettingsComponentStrings {
        let settingsComponentStrings: ISettingsComponentStrings = {
            dueBy: Localizer.getString("dueBy"),
            resultsVisibleTo: Localizer.getString("resultsVisibleTo"),
            resultsVisibleToAll: Localizer.getString("resultsVisibleToAll"),
            resultsVisibleToSender: Localizer.getString("resultsVisibleToSender"),
            datePickerPlaceholder: Localizer.getString("datePickerPlaceholder"),
            timePickerPlaceholder: Localizer.getString("timePickerPlaceholder"),
        };
        return settingsComponentStrings;
    }

    /**
     * Helper method to provide common settings props for both mobile and web view
     */
    getCommonSettingsProps() {
        return {
            resultVisibility: getStore().settings.resultVisibility,
            dueDate: getStore().settings.dueDate,
            locale: getStore().context.locale,
            renderForMobile: UxUtils.renderingForMobile(),
            strings: this.getStringsForSettings(),
            isMultiResponseAllowed: getStore().settings.isMultiResponseAllowed,
            shouldShowGametitleAlert: this.state.showError,
            onChange: (props: ISettingsComponentProps) => {
                updateSettings(props);
            },
            onMount: () => {
                UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
            },
        };
    }
}
