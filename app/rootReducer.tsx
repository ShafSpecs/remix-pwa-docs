// I like separating out reducer functions since they can get really large and complex

import type { PrevOrNextLink } from "./root";
import type { PackageData } from "./routes/$package.($slug)";

export type RootState = {
  next: PrevOrNextLink;
  prev: PrevOrNextLink;
  selected: PackageData;
};

export type Actions = {
  type: "updateLinks";
  payload: {
    next: PrevOrNextLink;
    prev: PrevOrNextLink;
    selected: PackageData;
  };
};

const RootReducer = (state: RootState, action: Actions) => {
  switch (action.type) {
    case "updateLinks":
      const { next, prev, selected } = action.payload;
      state.next = next;
      state.prev = prev;
      state.selected = selected;
      return state;
    default:
      return state;
  }
};

export default RootReducer;
