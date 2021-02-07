import { mutator } from "satcheljs";
import getStore from "../store/GamePlayStore";
import {
    setGameStatus,
    updateGameBoard,
    updateGameScore,
    addItemToGameBoard
} from "../actions/GamePlayAction";

mutator(setGameStatus, (msg) => {
    const store = getStore();
    store.gameStatus = msg.status;
});

mutator(updateGameBoard, (msg) => {
    const store = getStore();
    store.gameGridData = msg.board;
});

mutator(updateGameScore, (msg) => {
    const store = getStore();
    store.gameScore = msg.score;
});

mutator(addItemToGameBoard, (msg) => {
    const store = getStore();
    const grid = store.gameGridData;
    grid[msg.row][msg.column] = msg.value;
    store.gameGridData = grid;
});
