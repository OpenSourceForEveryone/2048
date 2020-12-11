import * as React from "react";
import { Localizer } from "../../../../../utils/Localizer";
import "./Header.scss";

export default function Header({ score }) {
  return (
    <div className="gameScore">
      {Localizer.getString("Score")} {score}
    </div>
  );
}
