import { NavLink } from "@remix-run/react";
import type { MetaDataObject } from "~/types/mdx";
import { classNames } from "~/utils/StyleHelpers";

const NavItem = ({ name, children }: MetaDataObject) => {
  return (
    <li>
      <h2 className="font-medium font-display text-slate-900 dark:text-white">{name}</h2>
      <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
        {children.map((sub) => {
          return (
            <li className="relative" key={sub.slug}>
              <NavLink prefetch="render" to={sub.slug} end={true}>
                {({ isActive }) => (
                  <span
                    className={classNames(
                      "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                      isActive
                        ? "font-semibold text-sky-500 before:bg-sky-500"
                        : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    {sub.title}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default NavItem;
