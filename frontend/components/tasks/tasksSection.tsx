"use client";
import React, { useEffect, useState } from "react";
import TaskList from "./taskList";
import Pagination from "../utils/pagination";
import ServerSideTasks from "./serverSideTasks";
import Search from "../search";
import { getTasks } from "../utils/api";

export interface Task {
  id: number;
  completed: boolean;
  name: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  completedAt: string;
}

export interface SearchParams {
  name: string;
  priority: string;
  state: string;
}

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortCompleted, setSortCompleted] = useState<boolean>(false);
  const [sortName, setSortName] = useState<number>(0);
  const [sortPriority, setSortPriority] = useState<number>(0);
  const [sortDueDate, setSortDueDate] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [taskChecked, setTaskChecked] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: "",
    priority: "All",
    state: "All",
  });

  useEffect(() => {
    const fetchInitialTasks = async () => {
      try {
        setLoadingTasks(true);
        const { tasks: fetchedTasks, totalPages } = await getTasks(
          0,
          searchParams,
        );
        console.log(fetchedTasks);
        setTasks(fetchedTasks);
        setNumberOfPages(totalPages);
        setLoadingTasks(false);
      } catch (error) {
        console.log("Error loading initial tasks: ", error);
        setLoadingTasks(false);
      }
    };

    fetchInitialTasks();
  }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedTasks = localStorage.getItem("tasks");
  //     if (storedTasks) {
  //       const parsedTasks = JSON.parse(storedTasks);
  //       setTasks(parsedTasks);
  //       setNumberOfPages(Math.ceil(parsedTasks.length / 6 || 1));
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (taskChecked) {
      setTaskChecked(false);
    }
  }, [taskChecked]);

  return (
    <>
      <Search
        setLoadingTasks={setLoadingTasks}
        setTasks={setTasks}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setNumberOfPages={setNumberOfPages}
        setCurrentPage={setCurrentPage}
      />
      <section className="z-20 mb-72">
        <TaskList
          setSortCompleted={setSortCompleted}
          setSortPriority={setSortPriority}
          setSortDueDate={setSortDueDate}
          setSortName={setSortName}
          sortCompleted={sortCompleted}
          sortName={sortName}
          sortDueDate={sortDueDate}
          sortPriority={sortPriority}
          searchParams={searchParams}
          setLoadingTasks={setLoadingTasks}
          setTaskList={setTasks}
          loadingTasks={loadingTasks}
          taskList={tasks}
          currentPage={currentPage}
          setNumberOfPages={setNumberOfPages}
          setCurrentPage={setCurrentPage}
        />
        <Pagination
          sortCompleted={sortCompleted}
          sortName={sortName}
          sortDueDate={sortDueDate}
          sortPriority={sortPriority}
          searchParams={searchParams}
          setLoadingTasks={setLoadingTasks}
          setTaskList={setTasks}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numberOfPages={numberOfPages}
          setNumberOfPages={setNumberOfPages}
        />
      </section>
    </>
  );
}
