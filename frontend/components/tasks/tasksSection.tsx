import React from "react";
import TaskList from "./taskList";
import Pagination from "../utils/pagination";

export default function TasksSection() {
  return (
    <>
      <section className="z-20 mb-72">
        <TaskList />
        <Pagination />
      </section>
    </>
  );
}
