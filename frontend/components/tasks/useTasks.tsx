import { useCallback } from "react";
import {
  markAsDone,
  markAsUndone,
  createTask,
  getTasks,
  deleteTask,
  editTask,
} from "../utils/api";
import { Task, NewTask } from "../utils/types";
import { useApp } from "../AppContext";

const useTasks = () => {
  const {
    setAvgTime,
    setPriorityAvg,
    priorityAvg,
    tasks,
    setTasks,
    currentPage,
    setNumberOfPages,
    setCurrentPage,
    searchParams,
    sortCompleted,
    sortPriority,
    sortName,
    sortDueDate,
    setLoadingTasks,
  } = useApp();

  const fetchSortedTasks = useCallback(
    async (page: number) => {
      try {
        setLoadingTasks(true);
        const filtersAndSort = {
          ...searchParams,
          sortCompleted,
          sortName,
          sortPriority,
          sortDueDate,
        };
        const { tasks: fetchedTasks, totalPages } = await getTasks(
          page - 1,
          filtersAndSort,
        );
        setTasks(fetchedTasks);
        setNumberOfPages(totalPages || 1);
        setLoadingTasks(false);
      } catch (error) {
        console.log("Error loading initial tasks: ", error);
        setLoadingTasks(false);
      }
    },
    [
      currentPage,
      searchParams,
      sortCompleted,
      sortName,
      sortPriority,
      sortDueDate,
      setLoadingTasks,
      setNumberOfPages,
      setTasks,
    ],
  );

  const handleToggleTask = useCallback(
    async (id: number) => {
      try {
        const taskToUpdate = tasks.find((task) => task.id === id);
        if (!taskToUpdate) return;

        const completedVal = taskToUpdate.completed;
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        );

        if (!completedVal) {
          const { avg, priority } = await markAsDone(id);
          setAvgTime(avg);
          setPriorityAvg({ ...priorityAvg, [taskToUpdate.priority]: priority });
        } else {
          const { avg, priority } = await markAsUndone(id);
          setAvgTime(avg);
          setPriorityAvg({ ...priorityAvg, [taskToUpdate.priority]: priority });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [tasks, setTasks, setAvgTime, setPriorityAvg, priorityAvg],
  );

  const handleAddTask = useCallback(
    async (newData: NewTask) => {
      if (newData.name && newData.priority) {
        try {
          await createTask(newData);
          fetchSortedTasks(currentPage);
        } catch (error) {
          console.error("Error while creating tasks");
        }
      }
    },
    [fetchSortedTasks],
  );

  const handleEditTask = useCallback(
    async (updatedTask: Task) => {
      try {
        await editTask(updatedTask);
        setTasks(
          tasks.map((t) =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [tasks, setTasks],
  );

  const handleDeleteTask = useCallback(
    async (id: number) => {
      //Go back one page
      let newCurrentPage = tasks.length === 1 ? currentPage - 1 : currentPage;
      setTasks(tasks.filter((task) => task.id !== id));
      try {
        await deleteTask(id);
        setCurrentPage(newCurrentPage <= 0 ? 1 : newCurrentPage);
        fetchSortedTasks(newCurrentPage);
      } catch (error) {
        console.error(error);
      }
    },
    [tasks, setTasks, fetchSortedTasks],
  );

  return {
    fetchSortedTasks,
    handleToggleTask,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
  };
};

export default useTasks;
