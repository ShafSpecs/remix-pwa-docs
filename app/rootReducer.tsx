// I like separating out reducer functions since they can get really large and complex

import type { PrevOrNextLink } from "./root";

export type RootState = {
  prev: PrevOrNextLink;
  next: PrevOrNextLink;
};

export type Actions = {
  type: "updateLinks";
  payload: {
    prev: PrevOrNextLink;
    next: PrevOrNextLink;
  };
};

const RootReducer = (state: RootState, action: Actions) => {
  switch (action.type) {
    case "updateLinks":
      return action.payload;
    default:
      return state;
  }
};

export default RootReducer;
