import { useApp } from "../AppContext";

/**
 * Custom hook to manage only the task list elements from useApp.
 *
 * @returns {Object} The task list state and functions to manage it.
 */
export const useTaskList = () => {
  const {
    tasks,
    loadingTasks,
    setLoadingTasks,
    currentPage,
    sortCompleted,
    sortPriority,
    sortName,
    sortDueDate,
  } = useApp();

  return {
    tasks,
    loadingTasks,
    setLoadingTasks,
    currentPage,
    sortCompleted,
    sortPriority,
    sortName,
    sortDueDate,
  };
};
