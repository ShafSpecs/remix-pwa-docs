import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return redirect(`/docs/main/installation`);
};