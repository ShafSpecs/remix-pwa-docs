import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader = ({ params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    return redirect('/docs/dev');
  }

  return redirect(`/docs/dev/${params.slug}`);
};
