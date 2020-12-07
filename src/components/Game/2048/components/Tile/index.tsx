import * as React from "react";
import getColour from '../../utils/getColours';
import './Tile.scss';

export default function Tile({ num }) {
  return (
    <div
      className='tile'
      style={{ background: getColour(num), color: num !== 0 && '#645B52' }}
    >
      {num ? num : ''}
    </div>
  );
}

