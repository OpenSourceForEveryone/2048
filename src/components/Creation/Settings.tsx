// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { DateTimePickerView } from "../DateTime";
import { Flex, Text, Checkbox } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { InputBox } from "../InputBox";
import getStore from "./../../store/CreationStore";
import { Constants } from "../../utils/Constants";
import {
    updateTitle, shouldValidateUI, updateSettings
} from "./../../actions/CreationActions";
import "./Settings.scss";
import "./CustomSettings.scss";

export interface ISettingsComponentProps {
    dueDate: number;
    locale?: string;
    resultVisibility: boolean;
    renderForMobile?: boolean;
    isMultiResponseAllowed: boolean;
    strings: ISettingsComponentStrings;
    shouldShowGametitleAlert?: boolean;
    renderDueBySection?: () => React.ReactElement<any>;
    renderResultVisibilitySection?: () => React.ReactElement<any>;
    onChange?: (props: ISettingsComponentProps) => void;
    onMount?: () => void;
}

export interface ISettingsComponentStrings {
    dueBy?: string;
    resultsVisibleTo?: string;
    resultsVisibleToAll?: string;
    resultsVisibleToSender?: string;
    datePickerPlaceholder?: string;
    timePickerPlaceholder?: string;
}
/**
 * <Settings> Settings component of creation view of game
 */

@observer
export class Settings extends React.PureComponent<ISettingsComponentProps> {
    private settingProps: ISettingsComponentProps;
    private inputTitleRef: HTMLElement;
    constructor(props: ISettingsComponentProps) {
        super(props);
        this.state = {
            allowMultipleTimes: true,
            shouldScoreVisibleToMe: true,
            showError: false
        };
    }
    componentDidMount() {
        if (this.props.onMount) {
            this.props.onMount();
        }
    }
    componentDidUpdate() {
        // If user presses send/create button without filling title, focus should land on title edit field.
        if (this.inputTitleRef) {
            this.inputTitleRef.focus();
        }
    }
    render() {
        this.settingProps = {
            dueDate: this.props.dueDate,
            locale: this.props.locale,
            strings: this.props.strings,
            isMultiResponseAllowed: this.props.isMultiResponseAllowed,
            resultVisibility: this.props.resultVisibility,
            shouldShowGametitleAlert: this.props.shouldShowGametitleAlert
        };

        return (
            <Flex className="body-container" column gap="gap.medium">
                {this.renderSettings()}
            </Flex>
        );
    }

    /**
     * Common to render settings view for both mobile and web
     */
    private renderSettings() {
        return (
            <Flex column className="game-creation-settings">
                {this.renderGameTitleSection()}
                {this.renderDueBySection()}
                {this.renderAdditionalSettingsSection()}
            </Flex>
        );
    }

    private renderGameTitleSection() {
        return (
            <Flex className="settings-item-margin" role="group" aria-label="additionlsettings" column gap="gap.smaller">
                <InputBox
                    fluid
                    maxLength={Constants.GAME_TITLE_MAX_LENGTH}
                    input={{
                        className: this.settingProps.shouldShowGametitleAlert ? "item-content title-box in-t invalid-title invalid-error" : "item-content title-box in-t"
                    }}
                    showError={this.settingProps.shouldShowGametitleAlert} errorText={Localizer.getString("GameTitleErrorAlert")}
                    placeholder={Localizer.getString("TitlePlaceHoler")}
                    aria-placeholder={Localizer.getString("TitlePlaceHoler")}
                    value={getStore().title}
                    onChange={(e) => {
                        updateTitle((e.target as HTMLInputElement).value);
                        shouldValidateUI(false); // setting this flag to false to not validate input everytime value changes
                    }}
                />
            </Flex>
        );
    }
    /**
     * Rendering due date section for settings view
     **/
    private renderDueBySection() {
        // handling mobile view differently
        return (
            <Flex role="group" aria-label={this.getString("dueBy")} column gap="gap.smaller">
                <label className="settings-item-title">{Localizer.getString("EndDate")}</label>
                <DateTimePickerView showTimePicker
                    minDate={new Date()}
                    locale={this.props.locale}
                    value={new Date(this.props.dueDate)}
                    placeholderDate={this.getString("datePickerPlaceholder")}
                    placeholderTime={this.getString("timePickerPlaceholder")}
                    renderForMobile={this.props.renderForMobile}
                    onSelect={(date: Date) => {
                        this.settingProps.dueDate = date.getTime();
                        this.props.onChange(this.settingProps);
                    }} />
            </Flex>
        );
    }
    /**
     * Rendering result visiblity
     */
    private renderAdditionalSettingsSection() {

        return (
            <Flex role="group" aria-label="additionlsettings" column gap="gap.smaller" style={{ padding: "16px 0px 0px 0px" }}>
                {this.renderLeaderBoardVisibilitySettingSection()}
                {this.renderAllowMultiplePlaySettingSection()}
            </Flex>
        );
    }

    private getString(key: string): string {
        if (this.props.strings && this.props.strings.hasOwnProperty(key)) {
            return this.props.strings[key];
        }
        return key;
    }

    private renderAllowMultiplePlaySettingSection() {
        return (
            <Flex styles={{ padding: "8px 16px 0px 0px" }} className="adjust-checkbox checkbox-gap">
                <Checkbox labelPosition="start" styles={{ padding: "2px 12px 0px 0px" }}
                 className="checklist-checkbox"
                 aria-describedby = {Localizer.getString("AllowMultipleTimePlay")}
                 checked={getStore().settings.isMultiResponseAllowed}
                 onClick={
                        () => {
                            this.settingProps.isMultiResponseAllowed = !this.settingProps.isMultiResponseAllowed;
                                //this.props.onChange(this.settingProps);
                            updateSettings(this.settingProps);
                        }
                    }
                     />
                <Flex column>
                    <Text content={Localizer.getString("AllowMultipleTimePlay")} className="setting-header" />
                    <Text content={Localizer.getString("AllowMultipleTimePlaySubstring")} className="setting-sub-text" />
                </Flex>
            </Flex>
        );
    }

    private renderLeaderBoardVisibilitySettingSection() {
        return (
            <Flex styles={{ padding: "8px 16px 0px 0px" }} className="adjust-checkbox checkbox-gap">
                <Checkbox labelPosition="start" styles={{ padding: "2px 12px 0px 0px" }}
                    className="checklist-checkbox"
                    aria-describedby = {Localizer.getString("LeaderBoardSetting")}
                    checked={getStore().settings.resultVisibility}
                    onClick={
                        () => {
                            this.settingProps.resultVisibility = !this.settingProps.resultVisibility;
                            //this.props.onChange(this.settingProps);
                            updateSettings(this.settingProps);
                        }
                    }
                />
                <Flex column>
                    <Text content={Localizer.getString("LeaderBoardSetting")} className="setting-header" />
                    <Text content={Localizer.getString("LeaderBoardSettingSubstring")} className="setting-sub-text" />
                </Flex>
            </Flex>
        );
    }
}
