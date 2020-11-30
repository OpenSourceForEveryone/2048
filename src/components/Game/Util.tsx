import { useEffect } from "react";

export const useEvent = (event:any, handler:any, passive:boolean = false) => {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener(event, handler, passive);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener(event, handler);
    };
  });
};

export const getColors = (num:number) => {
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
    default:
      return "rgb(250, 249, 248)";
  }
};