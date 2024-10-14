"use client";
import React, { useEffect, useState } from "react";
import TaskList from "./taskList";
import Pagination from "../utils/pagination";
import ServerSideTasks from "./serverSideTasks";
import Search from "../search";

export interface Task {
  id: number;
  completed: boolean;
  name: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  completedAt: string;
}

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [taskChecked, setTaskChecked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
        setNumberOfPages(Math.ceil(parsedTasks.length / 6 || 1));
      }
    }
  }, []);

  useEffect(() => {
    if (taskChecked) {
      setTaskChecked(false);
    }
  }, [taskChecked]);

  return (
    <>
      <Search />
      <section className="z-20 mb-72">
        <TaskList
          taskList={tasks}
          setTaskList={setTasks}
          currentPage={currentPage}
          setNumberOfPages={setNumberOfPages}
          setCurrentPage={setCurrentPage}
        />
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={numberOfPages}
        />
      </section>
    </>
  );
}
