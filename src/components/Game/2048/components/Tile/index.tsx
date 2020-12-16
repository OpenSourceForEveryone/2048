// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import {GameUtils} from "../../utils/gameUtils";
import "./Tile.scss";

/**
* <Tile> functional componenet for Game tiles
*/
export default function Tile({ num }) {
  return (
    <div
      className="tile"
      style={{ background: GameUtils.getColourOfTile(num), color: num !== 0 && "#645B52" }}
    >
      {num ? num : ""}
    </div>
  );
}
