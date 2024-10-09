"use client";
import React, { useState } from 'react'
import TaskItem from './taskItem';

export interface Task{
  id: number;
  completed: boolean;
  name: string;
  priority: string;
  dueDate: string; 
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  let nextId = tasks.length + 1;

  const handleAddTask = () => {
    if(newTaskName.trim() !== '' && newTaskDueDate.trim() !== ''){
      setTasks([...tasks, {id: nextId, name: newTaskName, completed: false, priority: 'Low',dueDate: newTaskDueDate }])
      setNewTaskDueDate('');
      setNewTaskName('');
      nextId++
    }
  } 

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map((task)=>
      task.id === id ? {...task, completed: true} : task
    ))
  }
  const handleEditTask = (id: number) => {
    
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task)=> task.id !== id))
  }
  return (
    <section>

        <div>
          <div id='tasksHeader'>
            <input type='checkbox'/>
            <button>Name</button>
            <button>Priority</button>
            <button>Due Date</button>
            <p>Actions</p>
          </div>
            {tasks.map((task) =>(
              <TaskItem
                key = {task.id}
                task = {task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}

              />
            ))}
        </div>

    </section>
  )
}
