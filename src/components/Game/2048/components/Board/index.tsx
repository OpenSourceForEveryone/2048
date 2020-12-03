import * as React from "react";
import Header from '../Header';
import Block from '../Block';
import './Board.scss';

export default function Board({ data, score }) {
  return (
    <>
    <div className='gameScore'>
      <Header score={score}  />
    </div>
    
     <div className='board__body'>
     {data.map((row, rowIndex) => {
       return (
         <div key={rowIndex} className='board__row'>
           {row.map((num, index) => (
             <Block num={num} key={index} />
           ))}
         </div>
       );
     })}
   </div>
    </>
  );
}
