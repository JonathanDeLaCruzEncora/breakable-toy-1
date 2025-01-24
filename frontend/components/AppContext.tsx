"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAvg, getTasks } from "../components/utils/api";
import {
  ContextProps,
  PriorityAvg,
  SearchParams,
  Task,
} from "../components/utils/types";

const AppContext = createContext<ContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortCompleted, setSortCompleted] = useState<boolean>(false);
  const [sortName, setSortName] = useState<number>(0);
  const [sortPriority, setSortPriority] = useState<number>(0);
  const [sortDueDate, setSortDueDate] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [avgTime, setAvgTime] = useState<number>(0);
  const [priorityAvg, setPriorityAvg] = useState<PriorityAvg>({
    High: 0,
    Medium: 0,
    Low: 0,
  });
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
        setTasks(fetchedTasks);
        setNumberOfPages(totalPages || 1);
        const { avg, Low, Medium, High } = await getAvg();
        setAvgTime(avg);
        setPriorityAvg({ Low, Medium, High });
        setLoadingTasks(false);
      } catch (error) {
        console.log("Error loading initial tasks: ", error);
        setLoadingTasks(false);
      }
    };

    fetchInitialTasks();
  }, []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        sortCompleted,
        sortName,
        sortPriority,
        sortDueDate,
        currentPage,
        loadingTasks,
        numberOfPages,
        avgTime,
        priorityAvg,
        searchParams,
        setTasks,
        setSortCompleted,
        setSortName,
        setSortPriority,
        setSortDueDate,
        setCurrentPage,
        setLoadingTasks,
        setNumberOfPages,
        setAvgTime,
        setPriorityAvg,
        setSearchParams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): ContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
