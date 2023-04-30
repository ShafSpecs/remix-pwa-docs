import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "@remix-run/react";
import { Fragment } from "react";
import { packages } from "~/utils/PackageHelpers";
import { useRoot } from "~/utils/providers/RootProvider";

const RouteListBox = () => {
  const navigate = useNavigate();
  const { selected } = useRoot();
  return (
    <Listbox value={selected}>
      <div className="relative mt-1 mb-6">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-sm cursor-default shadow-gray-300 dark:shadow-gray-700 dark:text-white focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
          <span className="block truncate">{selected.name}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon className="w-5 h-5 text-gray-400 dark:text-gray-200" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
        </Transition>
      </div>
    </Listbox>
  );
};

export default RouteListBox;
