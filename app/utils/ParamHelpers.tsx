import type { Params } from "@remix-run/react";
import invariant from "tiny-invariant";

export const RequireParam = (params: Params, param: string, message?: string) => {
  const value = params[param];
  invariant(value, message || `Missing required param: ${param}`);
  return value;
};
