// I like separating out reducer functions since they can get really large and complex

import type { PrevOrNextLink } from "./root";

export type RootState = {
  next: PrevOrNextLink;
  prev: PrevOrNextLink;
};

export type Actions = {
  type: "updateLinks";
  payload: {
    next: PrevOrNextLink;
    prev: PrevOrNextLink;
  };
};

const RootReducer = (state: RootState, action: Actions) => {
  switch (action.type) {
    case "updateLinks":
      const { next, prev } = action.payload;
      state.next = next;
      state.prev = prev;
      return state;
    default:
      return state;
  }
};

export default RootReducer;
