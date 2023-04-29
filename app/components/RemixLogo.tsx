import { useTheme } from "~/utils/providers/ThemeProvider";
import RemixLight from "./icons/RemixLight";
import RemixDark from "./icons/RemixDark";

/**
 *
 * @param light_color - should be a tailwind text-color class
 * @param dark_color - should be a tailwind text-color class
 * @param mobile - should be true if the logo is being used in the mobile header, hides logo on lg if mobile === false
 * @returns
 */
const RemixLogo = ({
  light_color,
  dark_color,
  mobile,
  height,
  width
}: {
  light_color?: string;
  dark_color?: string;
  mobile?: boolean;
  height?: string;
  width?: string;
}) => {
  const [theme] = useTheme();
  const h = height || "h-10";
  const w = width || "w-11";
  // Can use text-color to set fill by using fill="currentColor"
  if (theme === "light")
    return <RemixLight className={`${h} ${w} -ml-2 ${mobile ? "" : "lg:hidden"} ${light_color || "text-slate-700"}`} />;
  return <RemixDark className={`${h} ${w} -ml-2 ${mobile ? "" : "lg:hidden"} ${dark_color || "text-sky-100"}`} />;
};

export default RemixLogo;
