
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect } from "react";
/**
* Helper function for event listener 
* @param event KeyboardEvent
* @param handler Handler name
* @param passive passive true or false
*/

 export function gameEventListner(event, handler, passive = false) {
    useEffect(() => {
      window.addEventListener(event, handler, passive);
      return () => {
        window.removeEventListener(event, handler);
      };
    });
  };

  export default gameEventListner;