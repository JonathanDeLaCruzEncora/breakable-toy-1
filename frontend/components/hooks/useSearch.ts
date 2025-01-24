import { useApp } from "../AppContext";

/**
 * Custom hook to manage only the search elements from useApp.
 *
 * @returns {Object} The search state and functions to manage it.
 */
export const useSearch = () => {
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
  } = useApp();

  return {
    setSearchParams,
    setNumberOfPages,
    setCurrentPage,
    setTasks,
    setLoadingTasks,
    searchParams,
    sortName,
    sortPriority,
    sortDueDate,
  };
};
