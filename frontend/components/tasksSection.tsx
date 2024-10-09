"use client";
import React, { useState } from 'react'
import TaskList from './taskList'
import { Task } from './taskList'

export default function TasksSection() {
    const memTasks = [{id: 1, completed: false, name:'complete Project', priority: 'Low', dueDate: '2024/10/30'}]
    const [tasks, setTasks] = useState(memTasks)
    let numberOfPages = Math.ceil(tasks.length / 5)

  return (
    <section>
        <button>+ New To Do</button>
        <TaskList/>
        <p>
            {numberOfPages}
        </p>

    </section>
  )
}
