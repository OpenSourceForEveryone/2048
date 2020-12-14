// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ButtonProps } from "@fluentui/react-northstar";
import * as React from "react";
import { Constants } from "./Constants";
import { Localizer } from "./Localizer";

export class UxUtils {

    public static getTabKeyProps() {
        return {
            tabIndex: 0,
            role: "button",
            ...this.getClickOnCarriageReturnHandler()
        };
    }

    /**
     * Method to make the user list focusable and handle keyboard event in that
     */
    public static getListItemProps() {
        return {
            "data-is-focusable": "true",
            ...UxUtils.getClickOnCarriageReturnHandler()
        };
    }

    /**
     * Method to handle keyboard event
     */
    private static getClickOnCarriageReturnHandler() {
        return {
            onKeyUp: (event: React.KeyboardEvent<HTMLDivElement>) => {
                if ((event.which || event.keyCode) == Constants.CARRIAGE_RETURN_ASCII_VALUE) {
                    (event.currentTarget as HTMLDivElement).click();
                }
            }
        };
    }

    public static getTappableInputWrapperRole() {
        if (this.renderingForiOS()) {
            return {
                role: "combobox"
            };
        }
        return {
            role: "button"
        };
    }

    /**
     * Method to check is the current view is mobile view or not
     */
    public static renderingForMobile(): boolean {
        let currentHostClientType = document.body.getAttribute("data-hostclienttype");
        return currentHostClientType && (currentHostClientType == "ios" || currentHostClientType == "android");
    }

    /**
     * Method to check we the client is IOS
     */
    public static renderingForiOS(): boolean {
        let currentHostClientType = document.body.getAttribute("data-hostclienttype");
        return currentHostClientType && (currentHostClientType == "ios");
    }

    /**
     * Method to set focus on html element
     * @param element
     * @param customSelectorTypes
     */
    public static setFocus(element: HTMLElement, customSelectorTypes: string[]): void {
        if (customSelectorTypes && customSelectorTypes.length > 0 && element) {
            let queryString = customSelectorTypes.join(", ");
            let focusableItem = element.querySelector(queryString);
            if (focusableItem) {
                (focusableItem as HTMLElement).focus();
            }
        }
    }

    /**
     * Common method to format date
     * @param selectedDate
     * @param locale
     * @param options
     */
    public static formatDate(selectedDate: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
        let dateOptions = options ? options : { year: "numeric", month: "long", day: "2-digit", hour: "numeric", minute: "numeric" };
        let formattedDate = selectedDate.toLocaleDateString(locale, dateOptions);
        // check if M01, M02, ...M12 pattern is present in the string, if pattern is present, using numeric representation of the month instead
        if (formattedDate.match(/M[\d]{2}/)) {
            let newOptions = { ...dateOptions, "month": "2-digit" };
            formattedDate = selectedDate.toLocaleDateString(locale, newOptions);
        }
        return formattedDate;
    }

    /**
     * Get background color based on current selected theme
     * @param theme
     */
    public static getBackgroundColorForTheme(theme: string): string {
        let backColor: string = Constants.colors.defaultBackgroundColor;
        theme = theme || "";
        switch (theme.toLowerCase()) {
            case "dark":
                backColor = Constants.colors.darkBackgroundColor;
                break;
            case "contrast":
                backColor = Constants.colors.contrastBackgroundColor;
                break;
        }
        return backColor;
    }

    // get key for local storage
    public static getKey() {
        return Constants.INSTRUCTION_PAGE_LOCALSTORAGE;
    }

    public static shouldShowInstructionPage() {
        const key = this.getKey();
        let localStorage = window.localStorage;
        if (localStorage.getItem(key) === key) {
            return false;
        } else {
            return true;
        }
    }

    public static setLocaStorge(shouldCreate: boolean) {
        if (shouldCreate) {
            let localStorage = window.localStorage;
            const key = this.getKey();
            localStorage.setItem(key, key);
        } else {
            this.removeLocaStorge();
        }
    }

    public static removeLocaStorge() {
        let localStorage = window.localStorage;
        const key = this.getKey();
        localStorage.removeItem(key);
    }

    public static getDialogButtonProps(dialogDescription: string, buttonLabel: string): ButtonProps {
        let buttonProps: ButtonProps = {
            "content": buttonLabel
        };

        if (UxUtils.renderingForMobile()) {
            Object.assign(buttonProps, {
                "aria-label": Localizer.getString("DialogTalkback", dialogDescription, buttonLabel),
            });
        }
        return buttonProps;
    }

}
