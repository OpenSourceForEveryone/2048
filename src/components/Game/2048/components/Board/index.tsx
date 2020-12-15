// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import Tile from "../Tile";
import "./Board.scss";

 /**
  * <Board> functional componenet for Game board
  */
export default function Board({ data }) {
  return (
    <>
     <div className="board__body">
     {data.map((row, rowIndex) => {
       return (
         <div key={rowIndex} className="board__row">
           {row.map((num, index) => (
             <Tile num={num} key={index} />
           ))}
         </div>
       );
     })}
   </div>
    </>
  );
}
