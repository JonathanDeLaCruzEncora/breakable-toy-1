package com.example.backend.controller;

import com.example.backend.model.Task;
import com.example.backend.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Tests the getTasks method of TaskController.
     * Verifies that the response contains the expected tasks and total pages.
     */
    @Test
    public void testGetTasks() {
        List<Task> mockTasks = List.of(new Task(), new Task());
        when(taskService.filterTasks(any(), any(), any(), any(), any())).thenReturn(mockTasks);
        when(taskService.sortTasks(any(), anyInt(), anyInt(), anyInt())).thenReturn(mockTasks);
        when(taskService.paginateTasks(any(), anyInt(), anyInt())).thenReturn(mockTasks);

        ResponseEntity<Map<String, Object>> response = taskController.getTasks(0, 10, null, null, null, null, false, 0, 0, 0);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().get("totalPages"));
        assertEquals(mockTasks, response.getBody().get("tasks"));
    }

    /**
     * Tests the createTask method of TaskController.
     * Verifies that the response contains the created task.
     */
    @Test
    public void testCreateTask() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", "Test Task");
        requestBody.put("priority", "High");
        requestBody.put("dueDate", "2024-10-01");

        Task mockTask = new Task();
        mockTask.setId(1);
        mockTask.setName("Test Task");
        mockTask.setPriority("High");
        mockTask.setDueDate("2024-10-01");

        when(taskService.createTask(anyString(), anyString(), anyString())).thenReturn(mockTask);

        ResponseEntity<Task> response = taskController.createTask(requestBody);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(mockTask, response.getBody());
    }

    /**
     * Tests the updateTask method of TaskController.
     * Verifies that the response contains the updated task.
     */
    @Test
    public void testUpdateTask() {
        Map<String, String> updatedTask = new HashMap<>();
        updatedTask.put("name", "Updated Task");
        updatedTask.put("priority", "Medium");
        updatedTask.put("dueDate", "2024-11-01");

        Task mockTask = new Task();
        mockTask.setId(1);
        mockTask.setName("Original Task");
        mockTask.setPriority("High");
        mockTask.setDueDate("2024-10-01");

        when(taskService.findTaskById(1)).thenReturn(mockTask);

        ResponseEntity<Task> response = taskController.updateTask(1, updatedTask);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated Task", mockTask.getName());
        assertEquals("Medium", mockTask.getPriority());
        assertEquals("2024-11-01", mockTask.getDueDate());
    }

    /**
     * Tests the deleteTask method of TaskController.
     * Verifies that the task is deleted and the response status is NO_CONTENT.
     */
    @Test
    public void testDeleteTask() {
        Task mockTask = new Task();
        mockTask.setId(1);

        when(taskService.findTaskById(1)).thenReturn(mockTask);

        ResponseEntity<Void> response = taskController.deleteTask(1);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(taskService, times(1)).deleteTask(1); // Verify the deleteTask method call
    }

    /**
     * Tests the markTaskAsDone method of TaskController.
     * Verifies that the task is marked as done and the response contains the updated average values.
     */
    @Test
    public void testMarkTaskAsDone() {
        Task mockTask = new Task();
        mockTask.setId(1);
        mockTask.setCompleted(false);

        when(taskService.findTaskById(1)).thenReturn(mockTask);

        Map<String, Integer> mockResponse = new HashMap<>();
        mockResponse.put("avg", 10);
        mockResponse.put("priority", 5);

        when(taskService.changeCompletion(any(), any(), any(), eq(true))).thenReturn(mockResponse);

        ResponseEntity<Map<String, Integer>> response = taskController.markTaskAsDone(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResponse, response.getBody());
    }

    /**
     * Tests the markTaskAsUndone method of TaskController.
     * Verifies that the task is marked as undone and the response contains the updated average values.
     */
    @Test
    public void testMarkTaskAsUndone() {
        Task mockTask = new Task();
        mockTask.setId(1);
        mockTask.setCompleted(true);

        when(taskService.findTaskById(1)).thenReturn(mockTask);

        Map<String, Integer> mockResponse = new HashMap<>();
        mockResponse.put("avg", 10);
        mockResponse.put("priority", 5);

        when(taskService.changeCompletion(any(), any(), any(), eq(false))).thenReturn(mockResponse);

        ResponseEntity<Map<String, Integer>> response = taskController.markTaskAsUndone(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResponse, response.getBody());
    }

    /**
     * Tests the getAverage method of TaskController.
     * Verifies that the response contains the average values of task priorities.
     */
    @Test
    public void testGetAverage() {
        Map<String, Integer> mockResponse = new HashMap<>();
        mockResponse.put("avg", 0);
        mockResponse.put("Low", 0);
        mockResponse.put("Medium", 0);
        mockResponse.put("High", 0);
        ResponseEntity<Map<String, Integer>> response = taskController.getAverage();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResponse, response.getBody());
    }

    /**
     * Tests the getTasks method of TaskController with filters.
     * Verifies that the response contains the filtered tasks and total pages.
     */
    @Test
    public void testGetTasksWithFilters() {
        List<Task> mockTasks = List.of(new Task(), new Task());
        when(taskService.filterTasks(any(), eq("state"), eq("name"), eq("priority"), eq(true))).thenReturn(mockTasks);
        when(taskService.sortTasks(any(), anyInt(), anyInt(), anyInt())).thenReturn(mockTasks);
        when(taskService.paginateTasks(any(), anyInt(), anyInt())).thenReturn(mockTasks);

        ResponseEntity<Map<String, Object>> response = taskController.getTasks(0, 10, true, "state", "name", "priority", true, 0, 0, 0);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().get("totalPages"));
        assertEquals(mockTasks, response.getBody().get("tasks"));
    }

    /**
     * Tests the createTask method of TaskController with invalid data.
     * Verifies that the response status is BAD_REQUEST.
     */
    @Test
    public void testCreateTaskWithInvalidData() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", "");
        requestBody.put("priority", "High");

        ResponseEntity<Task> response = taskController.createTask(requestBody);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Tests the updateTask method of TaskController with invalid data.
     * Verifies that the response status is BAD_REQUEST.
     */
    @Test
    public void testUpdateTaskWithInvalidData() {
        Map<String, String> updatedTask = new HashMap<>();
        updatedTask.put("name", "");
        updatedTask.put("priority", "Medium");

        Task mockTask = new Task();
        mockTask.setId(1);
        mockTask.setName("Original Task");
        mockTask.setPriority("High");
        mockTask.setDueDate("2024-10-01");

        when(taskService.findTaskById(1)).thenReturn(mockTask);

        ResponseEntity<Task> response = taskController.updateTask(1, updatedTask);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Tests the deleteTask method of TaskController with a non-existent task.
     * Verifies that the response status is NOT_FOUND.
     */
    @Test
    public void testDeleteNonExistentTask() {
        when(taskService.findTaskById(1)).thenReturn(null);

        ResponseEntity<Void> response = taskController.deleteTask(1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /**
     * Tests the markTaskAsDone method of TaskController with a non-existent task.
     * Verifies that the response status is BAD_REQUEST.
     */
    @Test
    public void testMarkNonExistentTaskAsDone() {
        when(taskService.findTaskById(1)).thenReturn(null);

        ResponseEntity<Map<String, Integer>> response = taskController.markTaskAsDone(1);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Tests the markTaskAsUndone method of TaskController with a non-existent task.
     * Verifies that the response status is BAD_REQUEST.
     */
    @Test
    public void testMarkNonExistentTaskAsUndone() {
        when(taskService.findTaskById(1)).thenReturn(null);

        ResponseEntity<Map<String, Integer>> response = taskController.markTaskAsUndone(1);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}