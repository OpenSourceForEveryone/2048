import * as React from "react";
import './Header.scss';

export default function Header({ score }) {
  return (
    <div className='gameScore'>
      Score {score}
    </div>
  );
}
