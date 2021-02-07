// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import { GameStatus } from "../store/GamePlayStore";

export enum GamePlayAction {
    updateGameScore = "updateGameScore",
    updateGameBoard = "updateGameBoard",
    setGameStatus = "setGameStatus",
    addItemToGameBoard = "addItemToGameBoard"
}

export let setGameStatus = action(GamePlayAction.setGameStatus, (status: Partial<GameStatus>) => ({
    status: status
}));

export let updateGameBoard = action(GamePlayAction.updateGameBoard, (board: any[]) => ({
    board: board
}));

export let updateGameScore = action(GamePlayAction.updateGameScore, (score: number) => ({
    score: score
}));

export let addItemToGameBoard = action(GamePlayAction.addItemToGameBoard, (row: number, column: number, value: number) => ({
    row: row,
    column: column,
    value: value
}));
