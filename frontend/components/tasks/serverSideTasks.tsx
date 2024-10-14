"use client";
import React from "react";
import TaskList from "./taskList";
import Pagination from "../utils/pagination";
import { Task } from "./tasksSection";

interface Props {
  taskList: Task[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setTaskList: (list: Task[]) => void;
}

export default function ServerSideTasks({
  taskList,
  setTaskList,
  currentPage,
  setCurrentPage,
}: Props) {
  return <></>;
}
