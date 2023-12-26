import { Disclosure } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useSidebar } from "~/utils/providers/SidebarProvider";
import RemixLogo from "./RemixLogo";
import type { loader as RootLoader } from "~/root";
import { useOnClickOutside } from "usehooks-ts";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { useTransition, animated } from "react-spring";
import clsx from "clsx";
import NavItem from "./NavItem";
import type { MetaDataObject } from "~/utils/server/aws.server";

const MobileSidebar = ({ open, set }: any) => {
  // @ts-ignore
  const { meta } = useRouteLoaderData<typeof RootLoader>('root');
  const [closed, setClosed] = useSidebar();
  const sideBartransitions = useTransition(!closed, {
    from: { opacity: 0, transform: "translateX(-100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(-100%)" }
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(sidebarRef, () => {
    setClosed(true);
  });

  return sideBartransitions((style, item) =>
    item ? (
      <animated.div
        style={style}
        className={clsx("fixed inset-0 top-0 left-0 z-[9999] items-start w-screen h-screen pr-10 overflow-y-auto bg-slate-900/50 backdrop-blur lg:hidden", !closed ? "flex" : 'hidden')}
      >
        <div
          ref={sidebarRef}
          className="z-50 max-w-xs min-h-full px-4 pt-5 pb-12 bg-white w-80 dark:bg-slate-900 sm:px-6"
        >
          <div className="flex items-center">
            <Disclosure.Button className="relative mr-6 focus:outline-none focus:ring-0" onClick={() => setClosed(true)}>
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
            <ul className="space-y-8">
              {meta && meta.map((el: MetaDataObject, i: number) => (
                <NavItem key={`${i}-${el.name}`} {...el} />
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
