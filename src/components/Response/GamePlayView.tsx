// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { GameUtils } from "./GameUtils/GameUtils";
import GameEndView from "./GameEndView";
import { Flex } from "@fluentui/react-northstar";
import { Constants } from "../../utils/Constants";
import GameBoard from "./GameComponents/GameBoard";
import getStore, { GameStatus } from "../../store/ResponseStore";
import {
  updateGameBoard,
  setGameStatus,
  addItemToGameBoard,
  updateGameScore
} from "../../actions/ResponseAction";
import { Utils } from "../../utils/Utils";

/**
 * <GamePlayView> component for 2048 game logic
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */

@observer
class GamePlayView extends React.Component<any> {

  private store = getStore();
  private initialXposition = null;
  private initialYposition = null;
  private readonly blockSize = 4;
  constructor(props) {
    super(props);
    setGameStatus(GameStatus.InProgress);
    this.addNewItemInGameGrid();
    this.addNewItemInGameGrid();
  }

  componentDidMount() {
    window.addEventListener("keydown", this.keyBoardEventHandler, false);
    window.addEventListener("touchstart", this.handleTouchStart, false);
    window.addEventListener("touchmove", this.handleTouchMove, false);
    window.addEventListener("touchend", this.handleTouchEnd, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyBoardEventHandler);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }

  // Event handler for Arrow key press
  keyBoardEventHandler = (event) => {
    event.preventDefault();
    let currentScore = 0;
    const key = { ...Constants.KEY_MAP };
    switch (event.keyCode) {
      case Number(key.UP):
        currentScore = Number(this.gameBoardUpdateForUpMove());
        break;
      case key.DOWN:
        currentScore = Number(this.gameBoardUpdateForDownMove());
        break;
      case key.LEFT:
        currentScore = Number(this.gameBoardUpdateForLeftMove());
        break;
      case key.RIGHT:
        currentScore = Number(this.gameBoardUpdateForRightMove());
        break;
    }
    if (currentScore != 0) {
      updateGameScore(this.store.gameScore + currentScore);
    }
    let gameOverr = this.IsGameOver();
    if (gameOverr) {
      setGameStatus(GameStatus.End);
    }
  }

  // Event Hander for touch start for Mobile Device
  handleTouchStart = (event) => {
    this.initialXposition = event.touches[0].clientX;
    this.initialYposition = event.touches[0].clientY;
  }

  // Event Hander for touch move for Mobile Device
  handleTouchMove = (event) => {
    let currentScore = 0;
    if (this.initialXposition === null) {
      return;
    }
    if (this.initialYposition === null) {
      return;
    }
    let currentXPosition = event.touches[0].clientX;
    let currentYPosition = event.touches[0].clientY;
    let diffX = this.initialXposition - currentXPosition;
    let diffY = this.initialYposition - currentYPosition;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        currentScore = this.gameBoardUpdateForLeftMove();
      } else {
        // swiped right
        currentScore = this.gameBoardUpdateForRightMove();
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        currentScore = Number(this.gameBoardUpdateForUpMove());
      } else {
        // swiped down
        currentScore = Number(this.gameBoardUpdateForDownMove());
      }
    }
    if (currentScore != 0) {
      updateGameScore(this.store.gameScore + currentScore);
    }
    let gameOverr = this.IsGameOver();
    if (gameOverr) {
      setGameStatus(GameStatus.End);
    }
    this.initialXposition = null;
    this.initialYposition = null;
    event.preventDefault();
  }

  // Event Hander for touch end for Mobile Device
  handleTouchEnd = (event) => {
    this.initialXposition = null;
    this.initialYposition = null;
  }

  render() {
    return (
      <Flex
        column
        className="body-container"
        id="bodyContainer"
        gap="gap.medium"
      >
        { this.store.gameStatus === GameStatus.End ?
          <GameEndView score={this.store.gameScore} onlyOneAttempt={false} /> :
          <GameBoard boardData={this.store.gameGridData} gameScore={this.store.gameScore} tabIndex={0} />
        }
      </Flex>
    );
  }

  // Handle game board update for left move or swipe
  private gameBoardUpdateForLeftMove(isMove: boolean = true) {

    let oldGrid = this.store.gameGridData;
    let copyGrid = Utils.cloneDeep(this.store.gameGridData);
    let swipeLeftScore = 0;
    for (let rowLevel = 0; rowLevel < this.blockSize; rowLevel++) {
      let row = copyGrid[rowLevel];
      let lowerIndex = 0;
      let higherIndex = 1;

      while (lowerIndex <  this.blockSize) {
        if (higherIndex === this.blockSize) {
          higherIndex = lowerIndex + 1;
          lowerIndex++;
          continue;
        }
        if (row[lowerIndex] === 0 && row[higherIndex] === 0) {
          higherIndex++;
        } else if (row[lowerIndex] === 0 && row[higherIndex] !== 0) {
          row[lowerIndex] = row[higherIndex];
          row[higherIndex] = 0;
          higherIndex++;
        } else if (row[lowerIndex] !== 0 && row[higherIndex] === 0) {
          higherIndex++;
        } else if (row[lowerIndex] !== 0 && row[higherIndex] !== 0) {
          // if the 2 adjacent blocks are equal merge it and store it at lower level and increase the score
          if (row[lowerIndex] === row[higherIndex]) {
            row[lowerIndex] = row[lowerIndex] + row[higherIndex];
            swipeLeftScore += row[lowerIndex];
            row[higherIndex] = 0;
            higherIndex = lowerIndex + 1;
            lowerIndex++;
          } else {
            lowerIndex++;
            higherIndex = lowerIndex + 1;
          }
        }
      }
    }
    if (JSON.stringify(oldGrid) !== JSON.stringify(copyGrid)) {
      this.addNewItemInGameGrid();
    }
    if (isMove) {
      updateGameBoard(copyGrid);
    } else {
      return copyGrid;
    }
    return swipeLeftScore;
  }

   // Handle game board update for right move or swipe
  private gameBoardUpdateForRightMove(isMove: boolean = true) {

    let oldGrid = this.store.gameGridData;
    let copyGrid = Utils.cloneDeep(this.store.gameGridData);
    let swipeRightScore = 0;

    for (let rowLevel = this.blockSize-1; rowLevel >= 0; rowLevel--) {
      let row = copyGrid[rowLevel];
      let lowerIndex = row.length - 1;
      let higherIndex = lowerIndex - 1;

      while (lowerIndex > 0) {
        if (higherIndex === -1) {
          higherIndex = lowerIndex - 1;
          lowerIndex--;
          continue;
        }
        if (row[lowerIndex] === 0 && row[higherIndex] === 0) {
          higherIndex--;
        } else if (row[lowerIndex] === 0 && row[higherIndex] !== 0) {
          row[lowerIndex] = row[higherIndex];
          row[higherIndex] = 0;
          higherIndex--;
        } else if (row[lowerIndex] !== 0 && row[higherIndex] === 0) {
          higherIndex--;
        } else if (row[lowerIndex] !== 0 && row[higherIndex] !== 0) {
          // if the 2 adjacent blocks are equal merge it and store it at lower level and increase the score
          if (row[lowerIndex] === row[higherIndex]) {
            row[lowerIndex] = row[lowerIndex] + row[higherIndex];
            swipeRightScore += row[lowerIndex];
            row[higherIndex] = 0;
            higherIndex = lowerIndex - 1;
            lowerIndex--;
          } else {
            lowerIndex--;
            higherIndex = lowerIndex - 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(copyGrid)) {
      this.addNewItemInGameGrid();
    }

    if (isMove) {
      updateGameBoard(copyGrid);
    } else { return copyGrid; }

    return swipeRightScore;
  }

   // Handle game board update for down move or swipe
  private gameBoardUpdateForDownMove(isMove: boolean = true) {
    let copyGrid = Utils.cloneDeep(this.store.gameGridData);
    let oldGrid = JSON.parse(JSON.stringify(this.store.gameGridData));
    let swipeDownScore = 0;

    for (let columnLevel =  this.blockSize-1; columnLevel >= 0; columnLevel--) {
      let lowerIndex = copyGrid.length - 1;
      let higherIndex = lowerIndex - 1;

      while (lowerIndex > 0) {
        if (higherIndex === -1) {
          higherIndex = lowerIndex - 1;
          lowerIndex--;
          continue;
        }

        if (copyGrid[lowerIndex][columnLevel] === 0 &&
          copyGrid[higherIndex][columnLevel] === 0) {
          higherIndex--;
        } else if (copyGrid[lowerIndex][columnLevel] === 0 &&
          copyGrid[higherIndex][columnLevel] !== 0) {
          copyGrid[lowerIndex][columnLevel] = copyGrid[higherIndex][columnLevel];
          copyGrid[higherIndex][columnLevel] = 0;
          higherIndex--;
        } else if (copyGrid[lowerIndex][columnLevel] !== 0 &&
          copyGrid[higherIndex][columnLevel] === 0) {
          higherIndex--;
        } else if (copyGrid[lowerIndex][columnLevel] !== 0 && copyGrid[higherIndex][columnLevel] !== 0) {
          // if the 2 adjacent blocks are equal merge it and store it at lower level and increase the score
          if (copyGrid[lowerIndex][columnLevel] === copyGrid[higherIndex][columnLevel]) {
            copyGrid[lowerIndex][columnLevel] = copyGrid[lowerIndex][columnLevel] + copyGrid[higherIndex][columnLevel];
            swipeDownScore += copyGrid[lowerIndex][columnLevel];
            copyGrid[higherIndex][columnLevel] = 0;
            higherIndex = lowerIndex - 1;
            lowerIndex--;
          } else {
            lowerIndex--;
            higherIndex = lowerIndex - 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(copyGrid)) {
      this.addNewItemInGameGrid();
    }

    if (isMove) {
      updateGameBoard(copyGrid);
    } else { return copyGrid; }

    return swipeDownScore;
  }

  // Handle game board update for up move or swipe
  private gameBoardUpdateForUpMove(isMove: boolean = true) {
    let copyGrid = Utils.cloneDeep(this.store.gameGridData);
    let oldData = JSON.parse(JSON.stringify(this.store.gameGridData));
    let swipeUpScore = 0;

    for (let columnLevel = 0; columnLevel <  this.blockSize; columnLevel++) {
      let lowerIndex = 0;
      let higherIndex = 1;

      while (lowerIndex <  this.blockSize) {
        if (higherIndex ===  this.blockSize) {
          higherIndex = lowerIndex + 1;
          lowerIndex++;
          continue;
        }
        if (copyGrid[lowerIndex][columnLevel] === 0 &&
          copyGrid[higherIndex][columnLevel] === 0) {
          higherIndex++;
        } else if (copyGrid[lowerIndex][columnLevel] === 0 &&
          copyGrid[higherIndex][columnLevel] !== 0) {
          copyGrid[lowerIndex][columnLevel] = copyGrid[higherIndex][columnLevel];
          copyGrid[higherIndex][columnLevel] = 0;
          higherIndex++;
        } else if (copyGrid[lowerIndex][columnLevel] !== 0 &&
          copyGrid[higherIndex][columnLevel] === 0) {
          higherIndex++;
        } else if (copyGrid[lowerIndex][columnLevel] !== 0 &&
          copyGrid[higherIndex][columnLevel] !== 0) {
          // if the 2 adjacent blocks are equal merge it and store it at lower level and increase the score
          if (copyGrid[lowerIndex][columnLevel] === copyGrid[higherIndex][columnLevel]) {
            copyGrid[lowerIndex][columnLevel] = copyGrid[lowerIndex][columnLevel] + copyGrid[higherIndex][columnLevel];
            swipeUpScore += copyGrid[lowerIndex][columnLevel];
            copyGrid[higherIndex][columnLevel] = 0;
            higherIndex = lowerIndex + 1;
            lowerIndex++;
          } else {
            lowerIndex++;
            higherIndex = lowerIndex + 1;
          }
        }
      }
    }

    if (JSON.stringify(oldData) !== JSON.stringify(copyGrid)) {
      this.addNewItemInGameGrid();
    }

    if (isMove) {
      updateGameBoard(copyGrid);
    } else { return copyGrid; }

    return swipeUpScore;
  }

  // Helper method to add the new item in Game board grid
  private addNewItemInGameGrid() {
    let [row, column] = GameUtils.getNewPositionOfTile();
    const gameGrid = this.store.gameGridData;
    if (!GameUtils.IsGameBoardGridFull(gameGrid)) {
      while (gameGrid[row][column] !== 0) {
        [row, column] = GameUtils.getNewPositionOfTile();
      }
      // If the random value is greater than .5 take 2 new tile item otherwise take 4.
      const value = Math.random() > 0.5 ? 2 : 4;
      addItemToGameBoard(row, column, value);
    }
  }

  // Helper method to check if the game is over
  private IsGameOver() {
    if (JSON.stringify(this.store.gameGridData) !== JSON.stringify(this.gameBoardUpdateForLeftMove(false))) {
      return false;
    } else if (JSON.stringify(this.store.gameGridData) !== JSON.stringify(this.gameBoardUpdateForRightMove(false))) {
      return false;
    } else if (JSON.stringify(this.store.gameGridData) !== JSON.stringify(this.gameBoardUpdateForUpMove(false))) {
      return false;
    } else if (JSON.stringify(this.store.gameGridData) !== JSON.stringify(this.gameBoardUpdateForDownMove(false))) {
      return false;
    } else { return true; }
  }
}

export default GamePlayView;
