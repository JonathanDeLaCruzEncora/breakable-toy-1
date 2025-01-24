import { useApp } from "../AppContext";

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
