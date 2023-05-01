import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { Actions, RootState } from "~/rootReducer";

type RootContextType = { state: RootState; dispatch: Dispatch<Actions> };

const RootContext = createContext<RootContextType | undefined>(undefined);

/**
 * @description Saw we used packages and selected a lot in the root.tsx file. So I made a hook to get those values.
 * @returns
 */
function useRoot() {
  const context = useContext(RootContext);

  if (context === undefined) {
    throw new Error("useRoot must be used within a RootProvider");
  }
  const { state, dispatch } = context;
  return { ...state, dispatch };
}

export { RootContext, useRoot };
