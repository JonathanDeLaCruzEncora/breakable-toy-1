"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "./utils/dropdown";
import { FiSearch } from "react-icons/fi";
import { IoAlertCircleOutline } from "react-icons/io5";
import { SearchParams } from "./utils/types";
import { getTasks } from "./utils/api";
import { useSearch } from "./hooks/useSearch";

/**
 * Search component to filter tasks based on name, priority, and state.
 */
export default function Search() {
  const {
    setSearchParams,
    setNumberOfPages,
    setCurrentPage,
    setTasks,
    setLoadingTasks,
    searchParams,
    sortName,
    sortPriority,
    sortDueDate,
  } = useSearch();

  const [localSearchParams, setLocalSearchParams] = useState<SearchParams>({
    name: "",
    state: "All",
    priority: "All",
  });
  const priorityOptions = ["All", "High", "Medium", "Low"];
  const stateOptions = ["All", "Completed", "Pending"];
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  /**
   * Handle changes in dropdown selections.
   *
   * @param {keyof SearchParams} name - The name of the search parameter.
   * @param {string} value - The value of the search parameter.
   */
  const handleDropdownChange = (name: keyof SearchParams, value: string) => {
    setLocalSearchParams({
      ...localSearchParams,
      [name]: value,
    });
  };

  /**
   * Handle changes in text input fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSearchParams({
      ...localSearchParams,
      [name]: value,
    });
  };

  /**
   * Handle the search action to fetch tasks based on search parameters.
   */
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
    <div className="relative">
      <div className="glows absolute left-0 top-0 -z-10 h-16 w-72 -translate-x-1/4 -translate-y-1/2 bg-indigo-500"></div>
      <div className="glows absolute right-0 top-0 -z-10 h-16 w-72 -translate-y-1/2 translate-x-1/4 bg-indigo-500"></div>

      <section className="relative z-40 mx-10 max-w-screen-sm rounded-3xl bg-white bg-opacity-70 shadow-sm shadow-indigo-400/10 sm:mx-auto dark:border dark:border-slate-700 dark:bg-slate-700 dark:bg-opacity-50 dark:shadow-inner dark:shadow-white/10">
        <div className="z-10 flex flex-col items-center px-10 py-10 sm:flex-row sm:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <TextInput
              id="nameSearch"
              label="Name"
              value={localSearchParams.name}
              onChange={handleChange}
              placeholder="How is the task called?"
            />
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
              <IoAlertCircleOutline
                data-testid="alert-icon"
                className="absolute left-0 top-1/2 mr-2 size-6 -translate-x-8 -translate-y-1/2 text-red-600 dark:text-red-400"
              />
            )}
            <button
              className="flex h-fit cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-indigo-400 bg-indigo-400 px-4 py-1 text-right text-lg font-semibold text-white shadow-lg shadow-indigo-400/50 transition ease-in-out hover:border-indigo-500 hover:bg-indigo-500 active:border-slate-700 active:bg-slate-700 active:shadow-indigo-300 sm:m-0 dark:border-indigo-500 dark:bg-indigo-500 dark:shadow-none dark:hover:border-indigo-600 dark:hover:bg-indigo-600 dark:active:border-indigo-700 dark:active:bg-indigo-700"
              onClick={handleSearch}
            >
              <FiSearch className="my-1" size={20} color="white" />
              Search
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * TextInput component for search input fields.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The id of the input field.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.value - The value of the input field.
 * @param {function} props.onChange - The change handler for the input field.
 * @param {string} props.placeholder - The placeholder text for the input field.
 */
const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <div>
    <label className="inline-block w-16" htmlFor={id}>
      {label}
    </label>
    <input
      className="ml-2 inline-block w-80 rounded-md border border-slate-300 bg-gradient-to-r from-slate-300/50 to-slate-100 px-2 py-1 tracking-wider placeholder:text-sm placeholder:tracking-wider placeholder:text-slate-500 hover:border-slate-400 hover:from-white hover:to-white focus:bg-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:border-slate-400 dark:from-slate-700 dark:to-slate-800 dark:placeholder:text-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-700 dark:focus:bg-slate-700 dark:focus:ring-offset-slate-800"
      placeholder={placeholder}
      data-testid="search-input"
      id={id}
      name={id}
      type="text"
      value={value}
      onChange={onChange}
    />
  </div>
);
