const getColour = (num) => {
    switch(num) {
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
}

export default getColour;
