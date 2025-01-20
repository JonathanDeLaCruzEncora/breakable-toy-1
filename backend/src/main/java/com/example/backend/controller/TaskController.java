package com.example.backend.controller;

import com.example.backend.model.Task;
import com.example.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/**
 * REST controller for managing tasks.
 * Provides endpoints for task operations such as retrieval, creation, updating, deletion, and completion status.
 */
@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/todos")
public class TaskController {

    @Autowired
    private TaskService taskService;

    private Map<String, Integer> avgAmounts = new HashMap<>();
    private Map<String, Long> avgSums = new HashMap<>();

    /**
     * Constructor for TaskController.
     * Initializes the avgSums and avgAmounts maps with default values.
     */
    public TaskController() {
        avgSums.put("avg", 0L);
        avgSums.put("Low", 0L);
        avgSums.put("Medium", 0L);
        avgSums.put("High", 0L);

        avgAmounts.put("avg", 0);
        avgAmounts.put("Low", 0);
        avgAmounts.put("Medium", 0);
        avgAmounts.put("High", 0);
    }

    /**
     * Handles HTTP GET requests for retrieving tasks with various filtering, sorting, and pagination options.
     *
     * @param page the page number to retrieve, default is 0
     * @param size the number of tasks per page, default is 10
     * @param completed filter by completion status, optional
     * @param state filter by task state, optional
     * @param name filter by task name, optional
     * @param priority filter by task priority, optional
     * @param sortCompleted sort by completion status, default is false
     * @param sortName sort by task name, default is 0 (no sorting)
     * @param sortPriority sort by task priority, default is 0 (no sorting)
     * @param sortDueDate sort by task due date, default is 0 (no sorting)
     * @return a ResponseEntity containing a map with the filtered, sorted, and paginated tasks and the total number of pages
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getTasks(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "completed", required = false) Boolean completed,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "priority", required = false) String priority,
            @RequestParam(value = "sortCompleted", defaultValue = "false") Boolean sortCompleted,
            @RequestParam(value = "sortName", defaultValue = "0") int sortName,
            @RequestParam(value = "sortPriority", defaultValue = "0") int sortPriority,
            @RequestParam(value = "sortDueDate", defaultValue = "0") int sortDueDate) {

        // Retrieve tasks sorted by creation date
        List<Task> filteredTasks = taskService.getTasksSortedByCreatedAt();

        // Apply filters to the tasks
        filteredTasks = taskService.filterTasks(filteredTasks, state, name, priority, sortCompleted);

        // Apply sorting to the tasks
        filteredTasks = taskService.sortTasks(filteredTasks, sortName, sortPriority, sortDueDate);

        // Paginate the tasks
        List<Task> paginatedTasks = taskService.paginateTasks(filteredTasks, page, size);
        int totalPages = (int) Math.ceil((double) filteredTasks.size() / size);

        // Prepare the response
        Map<String, Object> response = Map.of(
                "tasks", paginatedTasks,
                "totalPages", totalPages
        );

        // Return the response entity
        return ResponseEntity.ok(response);
    }

    /**
     * Handles HTTP POST requests for creating a new task.
     *
     * @param requestBody a map containing the task details (name, priority, dueDate)
     * @return a ResponseEntity containing the created task or an error status
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Map<String, String> requestBody) {
        String name = requestBody.get("name");
        String priority = requestBody.get("priority");
        String dueDate = requestBody.get("dueDate");

        if (invalid(name) || invalid(priority))
            return ResponseEntity.badRequest().build();

        try {
            Task newTask = taskService.createTask(name, priority, dueDate == null ? "" : dueDate);
            System.out.println(taskService.tasks.size());
            return ResponseEntity.status(HttpStatus.CREATED).body(newTask);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Handles HTTP PUT requests for updating an existing task.
     *
     * @param id the ID of the task to update
     * @param updatedTask a map containing the updated task details (name, priority, dueDate)
     * @return a ResponseEntity containing the updated task or an error status
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Map<String, String> updatedTask) {
        Task existingTask = taskService.findTaskById(id);
        String priority = updatedTask.get("priority");
        String dueDate = updatedTask.get("dueDate");
        String name = updatedTask.get("name");

        if (invalid(existingTask)) return ResponseEntity.notFound().build();
        if (invalid(name) || invalid(priority)) return ResponseEntity.badRequest().build();

        existingTask.setPriority(priority);
        existingTask.setDueDate(dueDate);
        existingTask.setName(name);

        return ResponseEntity.ok(existingTask);
    }

    /**
     * Handles HTTP DELETE requests for deleting an existing task.
     *
     * @param id the ID of the task to delete
     * @return a ResponseEntity with no content or an error status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable int id) {
        Task existingTask = taskService.findTaskById(id);

        if (invalid(existingTask)) return ResponseEntity.notFound().build();

        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Handles HTTP POST requests for marking a task as done.
     *
     * @param id the ID of the task to mark as done
     * @return a ResponseEntity containing the updated average values or an error status
     */
    @PostMapping("/{id}/done")
    public ResponseEntity<Map<String, Integer>> markTaskAsDone(@PathVariable int id) {
        Task existingTask = taskService.findTaskById(id);
        Map<String, Integer> response = new HashMap<>();

        if (invalid(existingTask)) return ResponseEntity.badRequest().build();

        if (existingTask.isCompleted()) {
            response.put("avg", 0);
            response.put("priority", 0);
            return ResponseEntity.ok(response); // No need to do anything
        }

        response = taskService.changeCompletion(existingTask, avgSums, response, true);
        return ResponseEntity.ok(response);
    }

    /**
     * Handles HTTP PUT requests for marking a task as undone.
     *
     * @param id the ID of the task to mark as undone
     * @return a ResponseEntity containing the updated average values or an error status
     */
    @PutMapping("/{id}/undone")
    public ResponseEntity<Map<String, Integer>> markTaskAsUndone(@PathVariable int id) {
        Task existingTask = taskService.findTaskById(id);
        Map<String, Integer> response = new HashMap<>();

        if (invalid(existingTask)) return ResponseEntity.badRequest().build();

        if (!existingTask.isCompleted()) {
            response.put("avg", 0);
            response.put("priority", 0);
            return ResponseEntity.ok(response); // No need to do anything
        }

        response = taskService.changeCompletion(existingTask, avgSums, response, false);
        return ResponseEntity.ok(response);
    }

    /**
     * Handles HTTP GET requests for retrieving the average values of task priorities.
     *
     * @return a ResponseEntity containing the average values of task priorities
     */
    @GetMapping("/average")
    public ResponseEntity<Map<String, Integer>> getAverage() {
        Map<String, Integer> response = new HashMap<>();

        for (String priority : avgAmounts.keySet())
            response.put(priority, avgAmounts.get(priority) == 0 ? 0 : (int) Math.ceil((double) avgSums.get(priority) / avgAmounts.get(priority)));

        return ResponseEntity.ok(response);
    }

    /**
     * Validates if the given object is invalid.
     *
     * @param obj the object to validate
     * @return true if the object is invalid, false otherwise
     */
    private Boolean invalid(Object obj) {
        if (obj instanceof String) {
            return obj == null || ((String) obj).isEmpty();
        } else {
            return obj == null;
        }
    }
}