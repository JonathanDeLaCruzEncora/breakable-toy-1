"use client";
import React, { useEffect } from "react";
import TaskItem from "./taskItem";
import "react-datepicker/dist/react-datepicker.css";
import { FaSpinner } from "react-icons/fa";
import useTasks from "./useTasks";
import TableHeader from "./tableHeader";
import CreateTaskModal from "./createTaskModal";
import { useTaskList } from "../hooks/useTaskList";

/**
 * TaskList component to display a list of tasks with sorting and filtering options.
 */
export default function TaskList() {
  const {
    tasks,
    loadingTasks,
    setLoadingTasks,
    currentPage,
    sortName,
    sortPriority,
    sortDueDate,
    sortCompleted,
  } = useTaskList();
  const { fetchSortedTasks } = useTasks();

  useEffect(() => {
    fetchSortedTasks(currentPage);
    setLoadingTasks(false);
  }, [sortName, sortPriority, sortDueDate, sortCompleted]);

  return (
    <div className="container z-10 mx-auto flex max-w-screen-xl flex-col items-start overflow-x-auto px-3 sm:px-20">
      <CreateTaskModal />
      <div className="container relative mx-auto my-10 h-[612px] overflow-hidden overflow-x-auto rounded-xl bg-slate-50 shadow-sm shadow-indigo-400/10 dark:bg-slate-700">
        <table className="w-full table-fixed overflow-auto">
          <TableHeader />
          <tbody>
            {tasks &&
              !loadingTasks &&
              tasks.map((task) => <TaskItem key={task.id} task={task} />)}
          </tbody>
        </table>
        {loadingTasks ? (
          <>
            <div className="relative mx-auto my-6 h-16 w-16 text-indigo-400">
              <FaSpinner className="absolute h-full w-full animate-spin" />
            </div>
          </>
        ) : !tasks || tasks.length === 0 ? (
          <span className="dark: mt-8 block w-full text-center text-lg text-slate-700 dark:text-slate-100">
            No tasks were found...
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
