import RemixDark from "./icons/RemixDark";

/**
 * @param height - height of the logo (default: h-10)
 * @param width - width of the logo (default: w-11)
 * @param mobile - should be true if the logo is being used in the mobile header, hides logo on lg if mobile === true
 *
 * @returns
 */
const RemixLogo = ({ mobile, height, width }: { mobile?: boolean; height?: string; width?: string }) => {
  const h = height || "h-10";
  const w = width || "w-11";
  // Can use text-color to set fill by using fill="currentColor"

  return (
    <RemixDark
      className={`text-slate-700 dark:text-sky-100 ${h} ${w} -ml-2 ${!mobile ? "hidden md:block" : "md:hidden"} `}
    />
  );
};

export default RemixLogo;
