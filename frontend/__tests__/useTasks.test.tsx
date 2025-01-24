import { renderHook, act } from "@testing-library/react";
import useTasks from "@/components/tasks/useTasks";
import {
  markAsDone,
  markAsUndone,
  createTask,
  getTasks,
  deleteTask,
  editTask,
} from "@/components/utils/api";
import { useApp } from "@/components/AppContext";

jest.mock("@/components/utils/api");
jest.mock("@/components/AppContext");

describe("useTasks", () => {
  const setAvgTime = jest.fn();
  const setPriorityAvg = jest.fn();
  const setTasks = jest.fn();
  const setNumberOfPages = jest.fn();
  const setCurrentPage = jest.fn();
  const setLoadingTasks = jest.fn();

  interface Task {
    id: number;
    completed?: boolean;
    priority?: string;
    name?: string;
  }

  const mockUseApp: {
    setAvgTime: jest.Mock;
    setPriorityAvg: jest.Mock;
    priorityAvg: Record<string, number>;
    tasks: Task[];
    setTasks: jest.Mock;
    currentPage: number;
    setNumberOfPages: jest.Mock;
    setCurrentPage: jest.Mock;
    searchParams: Record<string, any>;
    sortCompleted: boolean;
    sortPriority: boolean;
    sortName: boolean;
    sortDueDate: boolean;
    setLoadingTasks: jest.Mock;
  } = {
    setAvgTime,
    setPriorityAvg,
    priorityAvg: {},
    tasks: [],
    setTasks,
    currentPage: 1,
    setNumberOfPages,
    setCurrentPage,
    searchParams: {},
    sortCompleted: false,
    sortPriority: false,
    sortName: false,
    sortDueDate: false,
    setLoadingTasks,
  };

  beforeEach(() => {
    (useApp as jest.Mock).mockReturnValue(mockUseApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch sorted tasks", async () => {
    const fetchedTasks = [{ id: 1, name: "Task 1" }];
    (getTasks as jest.Mock).mockResolvedValue({
      tasks: fetchedTasks,
      totalPages: 1,
    });

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.fetchSortedTasks(1);
    });

    expect(setLoadingTasks).toHaveBeenCalledWith(true);
    expect(setTasks).toHaveBeenCalledWith(fetchedTasks);
    expect(setNumberOfPages).toHaveBeenCalledWith(1);
    expect(setLoadingTasks).toHaveBeenCalledWith(false);
  });

  it("should toggle task completion", async () => {
    const tasks = [{ id: 1, completed: false, priority: "High" }];
    mockUseApp.tasks = tasks;
    (markAsDone as jest.Mock).mockResolvedValue({ avg: 100, priority: 50 });

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleToggleTask(1);
    });

    expect(setTasks).toHaveBeenCalledWith([
      { id: 1, completed: true, priority: "High" },
    ]);
    expect(setAvgTime).toHaveBeenCalledWith(100);
    expect(setPriorityAvg).toHaveBeenCalledWith({ High: 50 });
  });

  it("should handle error while toggling task completion", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const tasks = [{ id: 1, completed: false }];
    mockUseApp.tasks = tasks;
    (markAsDone as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleToggleTask(1);
    });

    expect(setTasks).toHaveBeenCalledWith([{ id: 1, completed: true }]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Error"));

    consoleErrorSpy.mockRestore(); // Restore the original console.error behavior
  });

  it("should add a new task", async () => {
    (createTask as jest.Mock).mockResolvedValue({});

    const newTask = {
      name: "New Task",
      priority: "High",
      dueDate: "",
    };

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleAddTask(newTask);
    });

    expect(createTask).toHaveBeenCalledWith(newTask);
    expect(setLoadingTasks).toHaveBeenCalledWith(true);
  });

  it("should handle error while adding a new task", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (createTask as jest.Mock).mockRejectedValue(new Error("Error"));

    const newTask = { name: "New Task", priority: "High", dueDate: "" };

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleAddTask(newTask);
    });

    expect(createTask).toHaveBeenCalledWith(newTask);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error while creating tasks");

    consoleErrorSpy.mockRestore(); // Restore the original console.error behavior
  });

  it("should edit a task", async () => {
    const tasks = [{ id: 1, name: "Task 1" }];
    mockUseApp.tasks = tasks;

    const updatedTask = {
      id: 1,
      name: "Updated Task",
      completed: false,
      priority: "High",
      dueDate: "",
      createdAt: "",
      completedAt: "",
    };

    (editTask as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleEditTask(updatedTask);
    });

    expect(editTask).toHaveBeenCalledWith(updatedTask);
    expect(setTasks).toHaveBeenCalledWith([{ ...updatedTask }]);
  });

  it("should handle error while editing a task", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const tasks = [{ id: 1, name: "Task 1" }];
    mockUseApp.tasks = tasks;

    const updatedTask = {
      id: 1,
      name: "Updated Task",
      completed: false,
      priority: "High",
      dueDate: "",
      createdAt: "",
      completedAt: "",
    };

    (editTask as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleEditTask(updatedTask);
    });

    expect(editTask).toHaveBeenCalledWith(updatedTask);
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Error"));

    consoleErrorSpy.mockRestore(); // Restore the original console.error behavior
  });

  it("should delete a task", async () => {
    const tasks = [{ id: 1, name: "Task 1" }];
    mockUseApp.tasks = tasks;
    (deleteTask as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleDeleteTask(1);
    });

    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(setTasks).toHaveBeenCalledWith([]);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("should handle error while deleting a task", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const tasks = [{ id: 1, name: "Task 1" }];
    mockUseApp.tasks = tasks;
    (deleteTask as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.handleDeleteTask(1);
    });

    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Error"));

    consoleErrorSpy.mockRestore();
  });
});
