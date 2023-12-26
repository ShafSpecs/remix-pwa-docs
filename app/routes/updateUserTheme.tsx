import { json, type ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "react-router-dom";
import { SetTheme } from "~/session.server";

export const loader = () => {
  return redirect("/");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method.toLowerCase();
  if (method === "post") {
    const formData = await request.formData();
    const theme = formData.get("theme");
    
    if (theme === "dark") {
      const set_session = await SetTheme(request, "dark");
      return json(
        { response: "dark" },
        {
          status: 200,
          headers: {
            "Set-Cookie": set_session
          }
        }
      );
    }

    if (theme === "light") {
      const set_session = await SetTheme(request, "light");
      return json(
        { response: "light" },
        {
          status: 200,
          headers: {
            "Set-Cookie": set_session
          }
        }
      );
    }

    return json({ response: "Invalid Theme" }, { status: 400 });
  }
  return json({ response: "Invalid Method" }, { status: 405 });
};
