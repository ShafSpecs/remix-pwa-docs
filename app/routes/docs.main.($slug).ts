import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader = ({ params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    return redirect('/docs/latest');
  }

  return redirect(`/docs/latest/${params.slug}`);
};
