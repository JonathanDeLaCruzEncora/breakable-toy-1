"use client";
import React, { useState } from "react";
import TaskList from "./taskList";
import { Task } from "./taskList";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import Pagination from "./pagination";

export default function TasksSection() {
  const memTasks = [
    {
      id: 1,
      completed: false,
      name: "complete Project",
      priority: "Low",
      dueDate: "2024/10/30",
    },
  ];
  const [tasks, setTasks] = useState(memTasks);
  let numberOfPages = Math.ceil(tasks.length / 5);

  return (
    <section className="z-20 mb-72">
      <TaskList />
      <Pagination totalPages={10} />
    </section>
  );
}
