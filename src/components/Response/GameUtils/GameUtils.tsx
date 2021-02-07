// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export namespace GameUtils {

  // Helper method to get the new position to place the new tile in the game
  export function getNewPositionOfTile() {
    const rowPosition = Math.floor(Math.random() * 4);
    const colPosition = Math.floor(Math.random() * 4);
    return [rowPosition, colPosition];
  }

  // Helper method to check if the board is full or not
  export function IsGameBoardGridFull(grid: any) {
    return !grid.some(row => row.includes(0));
  }

  /**
  * Helper function to get the tile color code
  * @param num number on tile
  */
  export function getColourOfTile(num: number) {
    switch (num) {
      case 2:
        return "#81ffe4";
      case 4:
        return "#4ed3a2";
      case 8:
        return "#4de9e7";
      case 16:
        return "#39c1ff";
      case 32:
        return "#7cf8ca";
      case 64:
        return "#a1efee";
      case 128:
        return "#8ad0ef";
      case 256:
        return "#79a4ff";
      case 512:
        return "#3eae60";
      case 1024:
        return "#bee1d2";
      case 2048:
        return "#adffaf";
      case 4096:
        return "#00fa61";
      case 8192:
        return "#00c8fa";
      case 16384:
        return "#04bd3b";
      default:
        return "#faf9f8";
    }
  }
}