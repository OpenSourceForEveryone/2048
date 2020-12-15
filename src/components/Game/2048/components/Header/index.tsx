// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Localizer } from "../../../../../utils/Localizer";
import "./Header.scss";

 /**
  * <Header> functional componenet for Game board header with score
 */

export default function Header({ score }) {
  return (
    <div className="gameScore">
      {Localizer.getString("Score")} {score}
    </div>
  );
}
