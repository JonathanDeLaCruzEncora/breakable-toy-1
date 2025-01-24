import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Task } from "@/components/utils/types";
import TaskItem from "@/components/tasks/taskItem";

const mockHandleToggleTask = jest.fn();

jest.mock("@/components/tasks/useTasks", () => ({
  __esModule: true,
  default: () => ({
    handleToggleTask: mockHandleToggleTask,
  }),
}));

const task: Task = {
  id: 1,
  name: "Test Task",
  priority: "High",
  dueDate: "2023-12-31",
  completed: false,
  completedAt: "",
  createdAt: "",
};

describe("TaskItem", () => {
  beforeEach(() => {
    render(
      <table>
        <tbody>
          <TaskItem task={task} />
        </tbody>
      </table>,
    );
  });

  it("renders the task name", () => {
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("renders the task priority", () => {
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders the task due date", () => {
    expect(screen.getByText("2023-12-31")).toBeInTheDocument();
  });

  it("calls handleToggleTask when the checkbox is clicked", () => {
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockHandleToggleTask).toHaveBeenCalledWith(task.id);
  });

  it("opens the edit modal when the edit button is clicked", () => {
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
    waitFor(() => {
      expect(screen.getAllByText("Edit Task")).not.toHaveLength(0);
    });
  });

  it("opens the delete modal when the delete button is clicked", () => {
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);
    waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this task?"),
      ).toBeInTheDocument();
    });
  });
});
