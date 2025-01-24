import {
  getTasks,
  createTask,
  editTask,
  markAsDone,
  markAsUndone,
  getAvg,
  deleteTask,
} from "@/components/utils/api";

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe("API Functions", () => {
  const mockTask = { id: 1, name: "Test Task", completed: false };
  const mockResponse = { success: true };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should fetch tasks with default parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([mockTask]),
      });

      const result = await getTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9090/todos?page=0",
      );
      expect(result).toEqual([mockTask]);
    });

    it("should throw an error if fetching tasks fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(getTasks()).rejects.toThrow("Failed to fetch tasks");
    });
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await createTask(mockTask);

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:9090/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockTask),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if creating a task fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(createTask(mockTask)).rejects.toThrow(
        "Failed to create task",
      );
    });
  });

  describe("editTask", () => {
    it("should edit a task", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await editTask(mockTask);

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:9090/todos/${mockTask.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockTask),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if editing a task fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(editTask(mockTask)).rejects.toThrow("Failed to edit task");
    });
  });

  describe("markAsDone", () => {
    it("should mark a task as done", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await markAsDone(mockTask.id);

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:9090/todos/${mockTask.id}/done`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if marking as done fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(markAsDone(mockTask.id)).rejects.toThrow(
        "Failed to check task",
      );
    });
  });

  describe("markAsUndone", () => {
    it("should mark a task as undone", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await markAsUndone(mockTask.id);

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:9090/todos/${mockTask.id}/undone`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if marking as undone fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(markAsUndone(mockTask.id)).rejects.toThrow(
        "Failed to uncheck task",
      );
    });
  });

  describe("getAvg", () => {
    it("should fetch average time", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getAvg();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9090/todos/average",
        { method: "GET" },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if fetching average fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(getAvg()).rejects.toThrow("Failed load average time");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: 204,
      });

      await deleteTask(mockTask.id);

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:9090/todos/${mockTask.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
    });

    it("should throw an error if deleting a task fails", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(deleteTask(mockTask.id)).rejects.toThrow(
        "Failed to delete task",
      );
    });
  });
});
