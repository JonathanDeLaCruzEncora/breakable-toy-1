import React, { useEffect, useRef, useState } from "react";
import Dropdown from "./utils/dropdown";
import { IoSearchOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { SearchParams, Task } from "./tasks/tasksSection";
import { getTasks } from "./utils/api";
import { IoAlertCircleOutline } from "react-icons/io5";

export default function Search({
  setSearchParams,
  setNumberOfPages,
  setCurrentPage,
  setTasks,
  setLoadingTasks,
  searchParams,
  sortName,
  sortPriority,
  sortDueDate,
}: {
  setSearchParams: (params: SearchParams) => void;
  setCurrentPage: (val: number) => void;
  setNumberOfPages: (total: number) => void;
  searchParams: SearchParams;
  setTasks: (list: Task[]) => void;
  setLoadingTasks: (value: boolean) => void;
  sortName: number;
  sortPriority: number;
  sortDueDate: number;
}) {
  const [localSearchParams, setLocalSearchParams] = useState<SearchParams>({
    name: "",
    state: "All",
    priority: "All",
  });
  const priorityOptions = ["All", "High", "Medium", "Low"];
  const stateOptions = ["All", "Completed", "Pending"];
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const handleDropdownChange = (name: keyof SearchParams, value: string) => {
    setLocalSearchParams({
      ...localSearchParams,
      [name]: value,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSearchParams({
      ...localSearchParams,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    try {
      setLoadingTasks(true);
      setSearchParams(localSearchParams);
      const { tasks: fetchedTasks, totalPages } = await getTasks(0, {
        ...localSearchParams,
        sortName,
        sortDueDate,
        sortPriority,
      });
      setTasks(fetchedTasks);
      setNumberOfPages(totalPages || 1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error while searching for tasks");
    }
    setLoadingTasks(false);
    setHasChanged(false);
  };

  useEffect(() => {
    const hasChanged =
      localSearchParams.name !== searchParams.name ||
      localSearchParams.priority !== searchParams.priority ||
      localSearchParams.state !== searchParams.state;

    setHasChanged(hasChanged);
  }, [localSearchParams]);

  return (
    <>
      <div className="relative">
        <div className="glows absolute left-0 top-0 -z-10 h-16 w-72 -translate-x-1/4 -translate-y-1/2 bg-indigo-500"></div>
        <div className="glows absolute left-1/2 top-0 -z-10 w-16 -translate-x-1/2 -translate-y-1/2 bg-indigo-500"></div>
        <div className="glows absolute right-0 top-0 -z-10 h-16 w-72 translate-x-1/4 translate-y-1/2 bg-indigo-500"></div>

        <section className="relative mx-10 max-w-screen-sm rounded-3xl bg-white bg-opacity-70 shadow-sm shadow-indigo-400/10 sm:mx-auto dark:bg-white dark:bg-opacity-20">
          <div className="z-10 flex flex-col items-center px-10 py-10 sm:flex-row sm:justify-between">
            <div className="flex flex-1 flex-col gap-6">
              <div className="">
                <label className="inline-block w-16" htmlFor="nameSearch">
                  Name
                </label>
                <input
                  className="ml-2 inline-block w-80 rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                  placeholder="How is the task called?"
                  id="nameSearch"
                  name="name"
                  type="text"
                  value={localSearchParams.name}
                  onChange={handleChange}
                />
              </div>
              <Dropdown
                id="priorityDropdown"
                label="Priority"
                options={priorityOptions}
                value={localSearchParams.priority}
                onChange={(value) => handleDropdownChange("priority", value)}
              />
              <Dropdown
                id="stateDropdown"
                label="State"
                options={stateOptions}
                value={localSearchParams.state}
                onChange={(value) => handleDropdownChange("state", value)}
              />
            </div>

            <div className="relative mt-6">
              {hasChanged && (
                <IoAlertCircleOutline className="absolute left-0 top-1/2 mr-2 size-6 -translate-x-8 -translate-y-1/2 text-red-600" />
              )}
              <button
                className="flex h-fit cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-right text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300 sm:m-0"
                onClick={handleSearch}
              >
                <FiSearch className="my-1" size={20} color="white" />
                Search
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
