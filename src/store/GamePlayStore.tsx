// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import "../mutator/GamePlayMutator";
import { Constants } from "../utils/Constants";

export enum GameStatus {
    NotStarted,
    InProgress,
    End,
    Paused,
    Expired
}

interface IGameStore {
   gameStatus: GameStatus;
   gameScore: number;
   gameGridData: any[];
}

const store: IGameStore = {
   gameStatus: GameStatus.NotStarted,
   gameScore: 0,
   gameGridData: Constants.GRID
};

export default createStore<IGameStore>("GamePlayStore", store);