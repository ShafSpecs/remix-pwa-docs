import { Disclosure } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useSidebar } from "~/utils/providers/SidebarProvider";
import RemixLogo from "./RemixLogo";
import { useTypedLoaderData } from "remix-typedjson";
import type { loader as RootLoader } from "~/root";
import NavItem from "./NavItem";
import { useOnClickOutside } from "usehooks-ts";
import { Link } from "@remix-run/react";
import RouteListBox from "./RouteListBox";
import { useRoot } from "~/utils/providers/RootProvider";
import { useTransition, animated } from "react-spring";

const MobileSidebar = () => {
  const { meta } = useTypedLoaderData<typeof RootLoader>();
  const [closed, setClosed] = useSidebar();
  const sideBartransitions = useTransition(!closed, {
    from: { opacity: 0, transform: "translateX(-100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(-100%)" }
  });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { selected } = useRoot();
  useOnClickOutside(sidebarRef, () => {
    setClosed(true);
  });

  return sideBartransitions((style, item) =>
    item ? (
      <animated.div
        style={style}
        className="fixed inset-0 top-0 left-0 z-50 flex items-start w-screen h-screen pr-10 overflow-y-auto bg-slate-900/50 backdrop-blur lg:hidden"
      >
        <div
          ref={sidebarRef}
          className="z-50 max-w-xs min-h-full px-4 pt-5 pb-12 bg-white w-80 dark:bg-slate-900 sm:px-6"
        >
          <div className="flex items-center">
            <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => setClosed(true)}>
              <XMarkIcon
                className="block w-6 h-6 stroke-2 text-slate-700 dark:text-sky-100"
                stroke="currentColor"
                aria-hidden="true"
                onClick={() => setClosed(true)}
              />
            </Disclosure.Button>
            <Link to={"/"}>
              <RemixLogo mobile />
            </Link>
          </div>
          <nav className="px-1 mt-5 text-base lg:text-sm">
            <RouteListBox />
            <ul className="space-y-9">
              {meta[selected.slug].map((e, i) => (
                <NavItem key={`${i}-${e.name}`} {...e} />
              ))}
            </ul>
          </nav>
        </div>
      </animated.div>
    ) : (
      <></>
    )
  );
};

export default MobileSidebar;
