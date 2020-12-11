import * as React from "react";
import Board from "./components/Board";
import "./App.scss";
import "./../game.scss";
import cloneDeep from "lodash.clonedeep";
import useEvent from "./Hooks/useEvent";
import useLocalStorage from "./Hooks/useLocalStorage";
import getNewPosition from "./utils/getNewPosition";
import isExist from "./utils/isExist";
import CongratulationView from "../CongrtulationView";
import { Flex } from "@fluentui/react-northstar";
import Header from "./components/Header";
import { UxUtils } from "../../../utils/UxUtils";
import { Constants } from "../../../utils/Constants";

export const GAME = (props) => {
  const UP = 38;
  const DOWN = 40;
  const LEFT = 37;
  const RIGHT = 39;
  // const STOP = 27;

  const INITIAL_DATA = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const [gameOver, setGameOver] = React.useState(false);
  const [data, setData] = React.useState(INITIAL_DATA);
  const [newGame, setNewGame] = useLocalStorage("newGame", true);
  const [score, setScore] = React.useState(0);
  const [isWon, setIsWon] = useLocalStorage("isWon", false);
  const [moveHistory, setMoveHistory] = useLocalStorage("moveHistory", []);
  const [undoMoves, setUndoMoves] = useLocalStorage("undoMoves", []);

  const initialize = () => {
    UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
    let newGrid = cloneDeep(INITIAL_DATA);
    addItem(newGrid);
    addItem(newGrid);
    setData(newGrid);
    setScore(0);
    setNewGame(false);
  };

  // Add item
  const addItem = (newGrid) => {
    let [rand1, rand2] = getNewPosition();
    while (newGrid[rand1][rand2] !== 0) {
      [rand1, rand2] = getNewPosition();
    }
    newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
  };

  // Swipe action

  const swipeLeft = (isMove = true) => {
    let oldGrid = data;
    let newArray1 = cloneDeep(data);
    let swipeLeftScore = 0;

    if (isWon) {
      return;
    }
    if (undoMoves.length) {
      setUndoMoves([]);
    }

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
      setMoveHistory([...moveHistory, oldGrid]);
      if (isExist(newArray1, 2048)) {
        setIsWon(true);
        setData(newArray1);
      } else {
        addItem(newArray1);
      }
    } else if (!isExist(oldGrid) && isMove && checkGameOver()) {
      // Game over
    }

    if (isMove) {
      setData(newArray1);
    } else { return newArray1; }

    return swipeLeftScore;
  };

  const swipeRight = (isMove = true) => {
    let oldGrid = data;
    let newArray2 = cloneDeep(data);
    let swipeRightScore = 0;

    if (isWon) {
      return;
    }

    if (undoMoves.length) {
      setUndoMoves([]);
    }

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
      setMoveHistory([...moveHistory, oldGrid]);
      if (isExist(newArray2, 2048)) {
        setIsWon(true);
        setData(newArray2);
        return;
      } else { addItem(newArray2); }
    } else if (!isExist(oldGrid) && isMove && checkGameOver()) {
      // Game over
    }

    if (isMove) {
      setData(newArray2);
    } else { return newArray2; }

    return swipeRightScore;
  };

  const swipeDown = (isMove = true) => {
    let b = [...data];
    let oldData = JSON.parse(JSON.stringify(data));
    let swipeDownScore = 0;

    if (isWon) {
      return;
    }

    if (undoMoves.length) {
      setUndoMoves([]);
    }

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
      setMoveHistory([...moveHistory, oldData]);
      if (isExist(b, 2048)) {
        setIsWon(true);
        setData(b);
      } else { addItem(b); }
    } else if (!isExist(oldData) && isMove && checkGameOver()) {
      // No action
    }

    if (isMove) {
      setData(b);
    } else { return b; }

    return swipeDownScore;

  };

  const swipeUp = (isMove = true) => {
    let b = [...data];
    let oldData = JSON.parse(JSON.stringify(data));
    let swipeUpScore = 0;

    if (isWon) {
      return;
    }

    if (undoMoves.length) {
      setUndoMoves([]);
    }

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
      setMoveHistory([...moveHistory, oldData]);
      if (isExist(b, 2048)) {
        setIsWon(true);
        setData(b);
      } else { addItem(b); }
    } else if (!isExist(oldData) && isMove && checkGameOver()) {
      // No action
    }

    if (isMove) {
      setData(b);
    } else { return b; }

    return swipeUpScore;
  };

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let myScore = 0;
    switch (event.keyCode) {
      case UP:
        myScore = Number(swipeUp());
        break;
      case DOWN:
        myScore = Number(swipeDown());
        break;
      case LEFT:
        myScore = swipeLeft();
        break;
      case RIGHT:
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

  const startTouch = (event: React.TouchEvent) => {
    initialX = event.touches[0].clientX;
    initialY = event.touches[0].clientY;
  };

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

  React.useEffect(() => {
    initialize();
  }, [newGame]);

  useEvent("keydown", handleKeyDown);
  useEvent("touchstart", startTouch);
  useEvent("touchmove", moveTouch);

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
          <div className="container" tabIndex = {props.tabIndex}>
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