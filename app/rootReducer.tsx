// I like separating out reducer functions since they can get really large and complex

import type { PrevOrNextLink } from "./root";
import type { PackageData } from "./routes/$package.($slug)";

export type RootState = {
  selected: PackageData;
};

export type Actions = {
  type: "updateLinks";
  payload: {
    selected: PackageData;
  };
};

const RootReducer = (state: RootState, action: Actions) => {
  switch (action.type) {
    case "updateLinks":
      const { selected } = action.payload;
      state.selected = selected;
      return state;
    default:
      return state;
  }
};

export default RootReducer;
