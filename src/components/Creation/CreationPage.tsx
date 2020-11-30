// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { callActionInstanceCreationAPI, updateSettings, goToPage } from "./../../actions/CreationActions";
import "./creation.scss";
import getStore, { Page } from "./../../store/CreationStore";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button, Loader } from "@fluentui/react-northstar";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Localizer } from "../../utils/Localizer";
import { Utils } from "../../utils/Utils";
import { ProgressState } from "./../../utils/SharedEnum";
import { ErrorView } from "../ErrorView";
import { UxUtils } from "./../../utils/UxUtils";
import { Settings, ISettingsComponentProps, ISettingsComponentStrings } from "./Settings";
import { InputBox } from "../InputBox";
import { INavBarComponentProps, NavBarComponent } from "../NavBarComponent";
import { Constants } from "./../../utils/Constants";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";
import { CheckBoxItems, ICheckBoxComponentProps } from "../CheckBox/CheckBox";

/**
 * <CreationPage> component for create view of poll app
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class CreationPage extends React.Component<any, any> {

    private settingsFooterComponentRef: HTMLElement;
    private validationErrorQuestionRef: HTMLElement;

    render() {
        console.log("localization string")
        console.log(ActionSdkHelper.getLocalizedStrings())
        let progressState = getStore().progressState;
        if (progressState === ProgressState.NotStarted || progressState == ProgressState.InProgress) {
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
            if (UxUtils.renderingForMobile()) {
                // this will load the setting view where user can change due date and result visibility
                return (
                    <Flex className="no-mobile-footer">
                        {this.renderSettingsForGame()}
                        <div className="settings-summary-mobile-container">
                            {this.renderFooterSection(true)}
                        </div>
                    </Flex>
                );
            } else {
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
                        content= {Localizer.getString("SendGameRequest")}
                        onClick={() => {
                            callActionInstanceCreationAPI();
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
            onChange: (props: ISettingsComponentProps) => {
                updateSettings(props);
            },
            onMount: () => {
                UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
            },
        };
    }
}
