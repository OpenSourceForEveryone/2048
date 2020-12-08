// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { UxUtils } from "../../utils/UxUtils";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Flex, List, Checkbox, Header, Text } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import "./checkbox.scss";

export interface ICheckBoxComponentProps {
  locale?: string;
  renderForMobile?: boolean;
  styles?: any,
  heading: string,
  subHeading: string,
  SettingName?: string,
  SettingValue?: boolean,
  onChange?: (props: ICheckBoxComponentProps) => void;
  onMount?: () => void;
}

/**
 * <Settings> Settings component of creation view of game
 */

export class CheckBoxItems extends React.PureComponent<ICheckBoxComponentProps> {
  private checkBoxProps: ICheckBoxComponentProps;
  constructor(props: ICheckBoxComponentProps) {
    super(props);
  }
  
  render() {
    this.checkBoxProps = {
      locale: this.props.locale,
      renderForMobile: this.props.renderForMobile,
      styles: this.props.styles,
      heading: this.props.heading,
      subHeading: this.props.subHeading,
    };
    return (
      <Flex styles={{ padding: '8px 16px 0px 0px' }} className="adjust-checkbox">
        <Checkbox labelPosition="start" styles={{ padding: "2px 12px 0px 0px" }} 
        onClick = {
          () => {
          }
        }/>
        <Flex column>
          <Text content={this.props.heading} weight="semibold" size="medium" />
          <Text content={this.props.subHeading} size="medium" disabled />
        </Flex>
      </Flex>
    );
  }
}
