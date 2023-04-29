import { Disclosure, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "~/utils/providers/SidebarProvider";
import Link from "./mdx/Link";
import RemixLogo from "./RemixLogo";
import type { PackageData, ValidPackages } from "~/routes/$package.($slug)";
import { useTransition, animated } from "react-spring";
import { useTypedLoaderData } from "remix-typedjson";
import type { loader as RootLoader } from "~/root";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MobileSidebar = ({
  selected,
  packages
}: {
  selected: PackageData;
  packages: Record<ValidPackages, PackageData>;
}) => {
  const navigate = useNavigate();
  const { meta } = useTypedLoaderData<typeof RootLoader>();
  const [closed, setClosed] = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [transition, api] = useTransition(closed, () => ({
    leave: { opacity: 1 },
    enter: { opacity: 0 },
    from: { opacity: 1 }
  }));
  return !closed ? (
    <div className="fixed inset-0 top-0 left-0 z-50 flex items-start w-screen h-screen pr-10 overflow-y-auto bg-slate-900/50 backdrop-blur lg:hidden">
      <div
        ref={sidebarRef}
        className="z-50 w-full max-w-xs min-h-full px-4 pt-5 pb-12 bg-white dark:bg-slate-900 sm:px-6"
      >
        <div className="flex items-center">
          <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => setClosed(true)}>
            <XMarkIcon
              className="block w-6 h-6 stroke-2 stroke-slate-500"
              aria-hidden="true"
              onClick={() => setClosed(true)}
            />
          </Disclosure.Button>
          <Link to={"/"} className="ml-6">
            <RemixLogo />
          </Link>
        </div>
        <nav className="px-1 mt-5 text-base lg:text-sm">
          <Listbox value={selected}>
            <div className="relative mt-1 mb-6">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-sm cursor-default shadow-gray-300 dark:shadow-gray-700 dark:text-white focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
                <span className="block truncate">{selected.name}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400 dark:text-gray-200" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <animated.div></animated.div>
              <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-md dark:shadow-gray-700 dark:bg-slate-900 max-h-60 ring-1 ring-black dark:text-gray-100 ring-opacity-5 focus:outline-none sm:text-sm">
                {Object.values(packages).map((pkg, packageIdx: number) => (
                  <Listbox.Option
                    key={packageIdx}
                    disabled={pkg.comingSoon}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-sky-100 text-sky-900" : "text-gray-900 dark:text-gray-200"
                      }`
                    }
                    onClick={() => navigate(`/${pkg.slug}`)}
                    value={pkg}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {pkg.name}{" "}
                          {pkg.comingSoon && <span className="text-base text-gray-400 dark:text-gray-500">🚧</span>}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <ul className="space-y-9">
            {meta[selected.slug][selected.position].children.map((e: any) => {
              return (
                <li key={e.name}>
                  <h2 className="font-medium font-display text-slate-900 dark:text-white">{e.name}</h2>
                  <ul className="mt-4 space-y-3 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                    {e.children.map((item: any) => {
                      return (
                        <li className="relative" key={item.slug}>
                          <NavLink to={item.slug} end>
                            {({ isActive }) => (
                              <span
                                className={classNames(
                                  "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                                  isActive
                                    ? "font-semibold text-sky-500 before:bg-sky-500"
                                    : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                                )}
                              >
                                {item.title}
                              </span>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default MobileSidebar;
