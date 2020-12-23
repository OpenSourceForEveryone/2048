// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import cloneDeep from "lodash.clonedeep";
import { GameUtils } from "./GameUtils/GameUtils";
import GameEndView from "./GameEndView";
import { Flex } from "@fluentui/react-northstar";
import { UxUtils } from "../../utils/UxUtils";
import { Constants } from "../../utils/Constants";
import gameEventListner from "./GameUtils/GameEventListner";
import GameBoard from "./GameComponents/GameBoard";

// Game Component
export const gamePlayView = (props) => {

  const [gameOver, setGameOver] = React.useState(false);
  const [data, setData] = React.useState(Constants.GRID);
  const [score, setScore] = React.useState(0);

  // helper method to initialize the game board
  const initialize = () => {
    UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
    let newGrid = cloneDeep(Constants.GRID);
    addItem(newGrid);
    addItem(newGrid);
    setData(newGrid);
    setScore(0);
  };

  // Add item to the game grid
  const addItem = (newGrid) => {
    let [row, column] = GameUtils.getNewPositionOfTile();
    while (newGrid[row][column] !== 0) {
      [row, column] = GameUtils.getNewPositionOfTile();
    }
    newGrid[row][column] = Math.random() > 0.5 ? 2 : 4;
  };

  // update the board on swip left or key left
  const gameUpdateForLeftMove = (isMove = true) => {
    let oldGrid = data;
    let copyGrid = cloneDeep(data);
    let swipeLeftScore = 0;

    for (let rowLevel = 0; rowLevel < 4; rowLevel++) {
      let row = copyGrid[rowLevel];
      let lowerIndex = 0;
      let higherIndex = 1;

      while (lowerIndex < 4) {
        if (higherIndex === 4) {
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
      addItem(copyGrid);
    }
    if (isMove) {
      setData(copyGrid);
    } else {
      return copyGrid;
    }

    return swipeLeftScore;
  };

  // update the board on swip right or key right
  const gameUpdateForRightMove = (isMove = true) => {
    let oldGrid = data;
    let copyGrid = cloneDeep(data);
    let swipeRightScore = 0;

    for (let rowLevel = 3; rowLevel >= 0; rowLevel--) {
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
      addItem(copyGrid);
    }

    if (isMove) {
      setData(copyGrid);
    } else { return copyGrid; }

    return swipeRightScore;
  };

  // update the board on swip down or key down
  const gameUpdateForDownMove = (isMove = true) => {
    let copyGrid = [...data];
    let oldGrid = JSON.parse(JSON.stringify(data));
    let swipeDownScore = 0;

    for (let columnLevel = 3; columnLevel >= 0; columnLevel--) {
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
      addItem(copyGrid);
    }

    if (isMove) {
      setData(copyGrid);
    } else { return copyGrid; }

    return swipeDownScore;
  };

  // update the board on swip up or key up
  const gameUpdateForUpMove = (isMove = true) => {
    let copyGrid = [...data];
    let oldData = JSON.parse(JSON.stringify(data));
    let swipeUpScore = 0;

    for (let columnLevel = 0; columnLevel < 4; columnLevel++) {
      let lowerIndex = 0;
      let higherIndex = 1;

      while (lowerIndex < 4) {
        if (higherIndex === 4) {
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
      addItem(copyGrid);
    }

    if (isMove) {
      setData(copyGrid);
    } else { return copyGrid; }

    return swipeUpScore;
  };

  // Function to check if the game is over
  const checkGameOver = () => {
    if (JSON.stringify(data) !== JSON.stringify(gameUpdateForLeftMove(false))) {
      return false;
    } else if (JSON.stringify(data) !== JSON.stringify(gameUpdateForRightMove(false))) {
      return false;
    } else if (JSON.stringify(data) !== JSON.stringify(gameUpdateForUpMove(false))) {
      return false;
    } else if (JSON.stringify(data) !== JSON.stringify(gameUpdateForDownMove(false))) {
      return false;
    } else { return true; }
  };

  // Event handler for keyboard button press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    let myScore = 0;
    const key = { ...Constants.KEY_MAP };
    switch (event.keyCode) {
      case Number(key.UP):
        myScore = Number(gameUpdateForUpMove());
        break;
      case key.DOWN:
        myScore = Number(gameUpdateForDownMove());
        break;
      case key.LEFT:
        myScore = gameUpdateForLeftMove();
        break;
      case key.RIGHT:
        myScore = gameUpdateForRightMove();
        break;
    }
    if (myScore != 0) {
      setScore(score + myScore);
      myScore = 0;
    }
    let gameOverr = checkGameOver();
    if (gameOverr) {
      setGameOver(true);
    }
  };

  let initialXPosition = null;
  let initialYPosition = null;
  // Event handle for start touch
  const handleTouchStart = (event: React.TouchEvent) => {
    initialXPosition = event.touches[0].clientX;
    initialYPosition = event.touches[0].clientY;
  };

  // Event handler for touch events like swipes(left, right, top and down)
  const handleTouchMove = (event: React.TouchEvent) => {
    let myScore = 0;
    if (initialXPosition === null) {
      return;
    }
    if (initialYPosition === null) {
      return;
    }
    let currentXPosition = event.touches[0].clientX;
    let currentYPosition = event.touches[0].clientY;
    let diffX = initialXPosition - currentXPosition;
    let diffY = initialYPosition - currentYPosition;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        myScore = gameUpdateForLeftMove();
      } else {
        // swiped right
        myScore = gameUpdateForRightMove();
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        myScore = Number(gameUpdateForUpMove());
      } else {
        // swiped down
        myScore = Number(gameUpdateForRightMove());
      }
    }
    if (myScore != 0) {
      setScore(score + myScore);
      myScore = 0;
    }
    let gameOverr = checkGameOver();
    if (gameOverr) {
      setGameOver(true);
    }
    initialXPosition = null;
    initialYPosition = null;
    event.preventDefault();
  };

  // initialize the game
  React.useEffect(() => {
    initialize();
  }, []);

  gameEventListner("keydown", handleKeyDown);
  gameEventListner("touchstart", handleTouchStart);
  gameEventListner("touchmove", handleTouchMove);

  return (
    <Flex
      column
      className="body-container"
      id="bodyContainer"
      gap="gap.medium"
    >
      { gameOver ?
        <GameEndView gameScore={score} shouldShowAlert="false" /> :
        <GameBoard boardData={data} gameScore={score} tabIndex={props.tabIndex} />
      }
    </Flex>
  );
};
export default gamePlayView;