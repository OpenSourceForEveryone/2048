
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import Board from "./components/Board";
import "./App.scss";
import "./../game.scss";
import cloneDeep from "lodash.clonedeep";
import {GameUtils} from "./utils/gameUtils"
import CongratulationView from "../CongrtulationView";
import { Flex } from "@fluentui/react-northstar";
import Header from "./components/Header";
import { UxUtils } from "../../../utils/UxUtils";
import { Constants } from "../../../utils/Constants";
import gameEventListner from "./utils/gameEventListner";

// Key Map for keyboard
const KeyMap = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
}

export const GAME = (props) => {
  const gameDate = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const [gameOver, setGameOver] = React.useState(false);
  const [data, setData] = React.useState(gameDate);
  const [score, setScore] = React.useState(0);

  // helper method to initialize the game board
  const initialize = () => {
    UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
    let newGrid = cloneDeep(gameDate);
    addItem(newGrid);
    addItem(newGrid);
    setData(newGrid);
    setScore(0);
  };

  // Add item to the game grid
  const addItem = (newGrid) => {
    let [rand1, rand2] = GameUtils.getNewPositionOfTile();
    while (newGrid[rand1][rand2] !== 0) {
      [rand1, rand2] = GameUtils.getNewPositionOfTile();
    }
    newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
  };

  // update the board on swip left or key left
  const swipeLeft = (isMove = true) => {
    let oldGrid = data;
    let newArray1 = cloneDeep(data);
    let swipeLeftScore = 0;

    for (let i = 0; i < 4; i++) {
      let b = newArray1[i];
      let slow = 0;
      let fast = 1;

      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast++;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            swipeLeftScore += b[slow];
            b[fast] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (JSON.stringify(oldGrid) !== JSON.stringify(newArray1)) {
      addItem(newArray1);
    }
    if (isMove) {
      setData(newArray1);
    } else {
      return newArray1;
    }

    return swipeLeftScore;
  };

  // update the board on swip right or key right
  const swipeRight = (isMove = true) => {
    let oldGrid = data;
    let newArray2 = cloneDeep(data);
    let swipeRightScore = 0;

    for (let i = 3; i >= 0; i--) {
      let b = newArray2[i];
      let slow = b.length - 1;
      let fast = slow - 1;

      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast--;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            swipeRightScore += b[slow];
            b[fast] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(newArray2)) {
      addItem(newArray2)
    }

    if (isMove) {
      setData(newArray2);
    } else { return newArray2; }

    return swipeRightScore;
  };

  // update the board on swip down or key down
  const swipeDown = (isMove = true) => {
    let b = [...data];
    let oldData = JSON.parse(JSON.stringify(data));
    let swipeDownScore = 0;

    for (let i = 3; i >= 0; i--) {
      let slow = b.length - 1;
      let fast = slow - 1;

      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }

        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] = b[slow][i] + b[fast][i];
            swipeDownScore += b[slow][i];
            b[fast][i] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }

    if (JSON.stringify(oldData) !== JSON.stringify(b)) {
      addItem(b)
    }

    if (isMove) {
      setData(b);
    } else { return b; }

    return swipeDownScore;
  };
  
  // update the board on swip up or key up
  const swipeUp = (isMove = true) => {
    let b = [...data];
    let oldData = JSON.parse(JSON.stringify(data));
    let swipeUpScore = 0;

    for (let i = 0; i < 4; i++) {
      let slow = 0;
      let fast = 1;

      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] = b[slow][i] + b[fast][i];
            swipeUpScore += b[slow][i];
            b[fast][i] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }

    if (JSON.stringify(oldData) !== JSON.stringify(b)) {
      addItem(b); 
    }

    if (isMove) {
      setData(b);
    } else { return b; }

    return swipeUpScore;
  };

  // Function to check if the game is over
  const checkGameOver = () => {
    if (JSON.stringify(data) !== JSON.stringify(swipeLeft(false))) {
      return false;
    } else if (JSON.stringify(data) !== JSON.stringify(swipeRight(false))) {
      return false;
    } else if (JSON.stringify(data) !== JSON.stringify(swipeUp(false))) {
      return false;
    } else if (JSON.stringify(data) !== JSON.stringify(swipeDown(false))) {
      return false;
    } else { return true; }
  };

  // Event handler for keyboard button press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    let myScore = 0;
    switch (event.keyCode) {
      case KeyMap.UP:
        myScore = Number(swipeUp());
        break;
      case KeyMap.DOWN:
        myScore = Number(swipeDown());
        break;
      case KeyMap.LEFT:
        myScore = swipeLeft();
        break;
      case KeyMap.RIGHT:
        myScore = swipeRight();
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

  let initialX = null;
  let initialY = null;

  // Event handle for start touch 
  const startTouch = (event: React.TouchEvent) => {
    initialX = event.touches[0].clientX;
    initialY = event.touches[0].clientY;
  };

  // Event handler for touch events like swipes(left, right, top and down)
  const moveTouch = (event: React.TouchEvent) => {
    let myScore = 0;

    if (initialX === null) {
      return;
    }
    if (initialY === null) {
      return;
    }
    let currentX = event.touches[0].clientX;
    let currentY = event.touches[0].clientY;
    let diffX = initialX - currentX;
    let diffY = initialY - currentY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        myScore = swipeLeft();
      } else {
        // swiped right
        myScore = swipeRight();
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        myScore = Number(swipeUp());
      } else {
        // swiped down
        myScore = Number(swipeDown());
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
    initialX = null;
    initialY = null;
    event.preventDefault();
  };
  
  // initialize the game 
  React.useEffect(() => {
    initialize();
  }, []);

  gameEventListner("keydown", handleKeyDown);
  gameEventListner("touchstart", startTouch);
  gameEventListner("touchmove", moveTouch);

  return (
    <Flex
      column
      className="body-container"
      id="bodyContainer"
      gap="gap.medium"
    >
      {gameOver ?
        <CongratulationView gameScore={score} shouldShowAlert="false" /> :
        <>
          <Header score={score} />
          <div className="container" tabIndex={props.tabIndex}>
            <Board
              data={data}
            />
          </div>
        </>
      }
    </Flex>
  );
};
export default GAME;