import { useApp } from "../AppContext";

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
