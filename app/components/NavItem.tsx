import { NavLink } from "@remix-run/react";
import slugify from "@sindresorhus/slugify";
import clsx from "clsx";
import { useMediaQuery } from "usehooks-ts";
import type { MetaDataObject } from "~/types/mdx";

const NavItem = ({ name, children }: MetaDataObject) => {
  const mobile = useMediaQuery('(max-width: 1024px)');
  
  return (
    <li className="mt-12 lg:mt-8">
      <h3 className="mb-8 font-semibold lg:mb-3 text-slate-900 dark:text-slate-200">{name}</h3>
      <ul className={clsx(
        'space-y-6 lg:space-y-2 border-l border-slate-100',
        mobile ? 'dark:border-slate-700' : 'dark:border-slate-800'
      )}>
        {children.map((sub) => {
          return (
            <li className="" key={sub.shortTitle}>
              <NavLink prefetch="intent" to={`/docs/main/${slugify(sub.shortTitle)}`} end={true}>
                {({ isActive }) => (
                  <span
                    className={clsx('block border-l pl-4 -ml-px', {
                      'text-sky-500 border-current font-semibold dark:text-sky-400': isActive,
                      'border-transparent hover:border-slate-400 dark:hover:border-slate-500': !isActive,
                      'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300':
                        !isActive,
                      'text-slate-400': !isActive,
                    })}
                  >
                    {sub.shortTitle}
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
