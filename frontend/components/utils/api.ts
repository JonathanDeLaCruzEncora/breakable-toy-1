// utils/api.ts

const API_BASE_URL = "http://localhost:9090/todos";

export const getTasks = async (page: number = 0, filtersAndSort: any = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...filtersAndSort,
  });

  const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
};

export const createTask = async (task: any) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
};

export const editTask = async (task: any) => {
  const response = await fetch(`${API_BASE_URL}/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to edit task");
  }

  return response.json();
};

export const markAsDone = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}/done`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to check task");
  }

  return response.json();
};

export const markAsUndone = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}/undone`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to uncheck task");
  }

  return response.json();
};

export const getAvg = async () => {
  const response = await fetch(`${API_BASE_URL}/average`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed load average time");
  }

  return response.json();
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
};
