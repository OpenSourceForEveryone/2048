
import * as React from "react";
import './ActionPanel.scss';

const nop = () => {};

export default function ActionPanel({
  disableUndo,
 
}) {
  return (
    <div className='action-panel'>
      <div
        className='action-panel__group'
        style={{ opacity: disableUndo ? 0.3 : 1 }}
      >
      </div>
</div>
  );
}
