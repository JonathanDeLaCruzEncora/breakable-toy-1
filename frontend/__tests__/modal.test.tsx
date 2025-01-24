import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ModalContentDelete from "@/components/modal/modalContentDelete";
import useTasks from "@/components/tasks/useTasks";
import { Task } from "@/components/utils/types";
import ModalContentEdit from "@/components/modal/modalContentEdit";
import CreateTaskModal from "@/components/tasks/createTaskModal";

jest.mock("@/components/tasks/useTasks");
const mockCloseModal = jest.fn();
const mockHandleDeleteTask = jest.fn();
const task: Task = {
  id: 1,
  name: "Test Task",
  completed: false,
  priority: "low",
  dueDate: "",
  createdAt: "",
  completedAt: "",
};

describe("ModalContentDelete", () => {
  beforeEach(() => {
    (useTasks as jest.Mock).mockReturnValue({
      handleDeleteTask: mockHandleDeleteTask,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the modal content correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <ModalContentDelete closeModal={mockCloseModal} task={task} />,
    );

    expect(getByText("Delete Task")).toBeInTheDocument();
    expect(
      getByText("You are about to delete the next task:"),
    ).toBeInTheDocument();
    expect(getByPlaceholderText("How will the task be called?")).toHaveValue(
      task.name,
    );
    expect(getByText("Are you sure?")).toBeInTheDocument();
    expect(getByText("Cancel")).toBeInTheDocument();
    expect(getByText("Delete")).toBeInTheDocument();
  });

  it("should call closeModal when Cancel button is clicked", () => {
    const { getByText } = render(
      <ModalContentDelete closeModal={mockCloseModal} task={task} />,
    );

    fireEvent.click(getByText("Cancel"));
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should call handleDeleteTask and closeModal when Delete button is clicked", () => {
    const { getByText } = render(
      <ModalContentDelete closeModal={mockCloseModal} task={task} />,
    );

    fireEvent.click(getByText("Delete"));
    expect(mockHandleDeleteTask).toHaveBeenCalledWith(task.id);
    expect(mockCloseModal).toHaveBeenCalled();
  });
});

const mockHandleChange = jest.fn();
const mockHandleDropdownChange = jest.fn();
const mockSetUpdatedTask = jest.fn();
const mockHandleEditTask = jest.fn();

const updatedTask: Task = {
  id: 1,
  name: "Test Task",
  priority: "Medium",
  dueDate: "2023-12-31",
  completed: false,
  createdAt: "",
  completedAt: "",
};

describe("ModalContentEdit", () => {
  beforeEach(() => {
    (useTasks as jest.Mock).mockReturnValue({
      handleEditTask: mockHandleEditTask,
    });
    render(
      <ModalContentEdit
        updatedTask={updatedTask}
        handleChange={mockHandleChange}
        handleDropdownChange={mockHandleDropdownChange}
        closeModal={mockCloseModal}
        setUpdatedTask={mockSetUpdatedTask}
      />,
    );
  });

  it("renders the component", () => {
    expect(screen.getAllByText("Edit Task")).not.toHaveLength(0);
  });

  it("displays the task name", () => {
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
  });

  it("displays the task priority", () => {
    expect(screen.getByText("Priority*")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("displays the due date", () => {
    expect(screen.getByPlaceholderText("YYYY-MM-DD")).toHaveValue("2023-12-31");
  });

  it("displays an error message if required fields are missing", () => {
    const elements = screen.getAllByText("Edit Task");
    const button = elements[elements.length - 1]; // Assuming the button you want is the last one

    expect(
      screen.queryByText("All elements with (*) are required"),
    ).not.toBeInTheDocument();

    fireEvent.click(button);

    waitFor(() => {
      expect(
        screen.queryByText("All elements with (*) are required"),
      ).toBeInTheDocument();
    });
  });
});

const mockHandleAddTask = jest.fn();

describe("CreateTaskModal", () => {
  beforeEach(() => {
    render(<CreateTaskModal />);
  });

  it("renders the Create button", () => {
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("opens the modal when the Create button is clicked", () => {
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  it("displays an error message if required fields are missing", () => {
    fireEvent.click(screen.getByText("Create"));
    fireEvent.click(screen.getByText("Add Task"));
    expect(
      screen.getByText("All elements with (*) are required"),
    ).toBeInTheDocument();
  });
});
