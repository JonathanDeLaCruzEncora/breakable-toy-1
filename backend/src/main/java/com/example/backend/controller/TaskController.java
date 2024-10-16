package com.example.backend.controller;
import com.example.backend.model.Task;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/todos")
public class TaskController {
    private List<Task> tasks = new ArrayList<>();
    private int currentId = 1;

    public TaskController() {
        // Sample data
        Task task3 = createTask("Sample Task 3", "Low", "2024-10-15");
        Task task4 = createTask("Sample Task 4", "High", "2024-10-20");
        Task task5 = createTask("Sample Task 5", "Medium", "2024-10-25");
        Task task6 = createTask("Sample Task 6", "Low", "2024-11-02");
        Task task7 = createTask("Sample Task 7", "High", "2024-11-05");
        Task task8 = createTask("Sample Task 8", "Medium", "2024-12-10");
        Task task9 = createTask("Sample Task 9", "Low", "2024-12-15");
        Task task10 = createTask("Sample Task 10", "High", "2024-12-20");
        Task task11 = createTask("Sample Task 11", "Medium", "2024-10-22");
        Task task12 = createTask("Sample Task 12", "Low", "2024-10-30");
        Task task13 = createTask("Sample Task 13", "High", "2024-11-10");
        Task task14 = createTask("Sample Task 14", "Medium", "2024-11-15");
        Task task15 = createTask("Sample Task 15", "Low", "2024-11-20");
        Task task16 = createTask("Sample Task 16", "High", "2024-12-01");
        Task task17 = createTask("Sample Task 17", "Medium", "2024-12-05");
        Task task18 = createTask("Sample Task 18", "Low", "2024-12-10");
        Task task19 = createTask("Sample Task 19", "High", "2024-12-15");
        Task task20 = createTask("Sample Task 20", "Medium", "2024-12-20");
        Task task21 = createTask("Sample Task 21", "Low", "2024-12-25");
        Task task22 = createTask("Sample Task 22", "High", "2024-12-30");
        Task task23 = createTask("Sample Task 23", "Medium", "2024-11-01");
        Task task24 = createTask("Sample Task 24", "Low", "2024-11-07");
        Task task25 = createTask("Sample Task 25", "High", "2024-11-12");
        Task task26 = createTask("Sample Task 26", "Medium", "2024-11-17");
        Task task27 = createTask("Sample Task 27", "Low", "2024-11-22");
        Task task28 = createTask("Sample Task 28", "High", "2024-11-27");
        Task task29 = createTask("Sample Task 29", "Medium", "2024-12-03");
        Task task30 = createTask("Sample Task 30", "Low", "2024-12-08");
        Task task31 = createTask("Sample Task 31", "High", "2024-12-13");
        Task task32 = createTask("Sample Task 32", "Medium", "2024-12-18");

        tasks.add(task3);
        tasks.add(task4);
        tasks.add(task5);
        tasks.add(task6);
        tasks.add(task7);
        tasks.add(task8);
        tasks.add(task9);
        tasks.add(task10);
        tasks.add(task11);
        tasks.add(task12);
        tasks.add(task13);
        tasks.add(task14);
        tasks.add(task15);
        tasks.add(task16);
        tasks.add(task17);
        tasks.add(task18);
        tasks.add(task19);
        tasks.add(task20);
        tasks.add(task21);
        tasks.add(task22);
        tasks.add(task23);
        tasks.add(task24);
        tasks.add(task25);
        tasks.add(task26);
        tasks.add(task27);
        tasks.add(task28);
        tasks.add(task29);
        tasks.add(task30);
        tasks.add(task31);
        tasks.add(task32);

    }


    private List<Task> getTasksSortedByCreatedAt() {
        return tasks.stream()
            .sorted(Comparator.comparing(Task::getCreatedAt).reversed()) // Reverses the comparator
            .collect(Collectors.toList());
    }
    

    private Task createTask(String name, String priority, String dueDate) {
        Task task = new Task();
        task.setId(currentId++);
        task.setCompleted(false);
        task.setName(name);
        task.setPriority(priority);
        task.setDueDate(dueDate);
        task.setCreatedAt(LocalDateTime.now());
        task.setCompletedAt(null);
        return task;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> getTasks(
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

        List<Task> filteredTasks = getTasksSortedByCreatedAt();

        // Filter by completion status
        if (state != null && !state.isEmpty() && !state.equals("All")) {
            System.out.println("completed");
            filteredTasks = filteredTasks.stream()
                    .filter(task -> task.isCompleted() == (state.equals("Completed")?true:false))
                    .collect(Collectors.toList());
        }

        // Filter by name
        if (name != null && !name.isEmpty()) {
            System.out.println("name");
            filteredTasks = filteredTasks.stream()
                    .filter(task -> task.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Filter by priority
        if (priority != null && !priority.isEmpty() && !priority.equals("All")) {
            System.out.println("Priority");
            filteredTasks = filteredTasks.stream()
                    .filter(task -> task.getPriority().equalsIgnoreCase(priority))
                    .collect(Collectors.toList());
        }

        // Pagination
        int start = Math.min(page * size, filteredTasks.size());
        int end = Math.min((page + 1) * size, filteredTasks.size());
        List<Task> pagedTasks = filteredTasks.subList(start, end);

        int totalPages = (int) Math.ceil((double) filteredTasks.size() / size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("tasks", pagedTasks);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Map<String,String> requestBody) {
        String name = requestBody.get("name");
        String priority = requestBody.get("priority");
        String dueDate = requestBody.get("dueDate");

        if (name == null || name.isEmpty() || priority == null || priority.isEmpty() ) {
            return ResponseEntity.badRequest().build();
        }

        Task newTask = createTask(name, priority, dueDate == null ? "": dueDate);
        tasks.add(newTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Task updatedTask) {
        Task existingTask = findTaskById(id);
        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedTask.getName() != null) {
            existingTask.setName(updatedTask.getName());
        }
        if (updatedTask.getDueDate() != null) {
            existingTask.setDueDate(updatedTask.getDueDate());
        }
        if (updatedTask.getPriority() != null) {
            existingTask.setPriority(updatedTask.getPriority());
        }

        return ResponseEntity.ok(existingTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable int id){
       
        Task existingTask = findTaskById(id);
        if(existingTask == null){
            return ResponseEntity.notFound().build();
        }
        tasks.remove(existingTask);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<Void> markTaskAsDone(@PathVariable int id) {
        System.out.println(id);
        Task existingTask = findTaskById(id);
        if (existingTask == null || existingTask.isCompleted()) {
            return ResponseEntity.ok().build(); // No error, nothing to do
        }

        existingTask.setCompleted(true);
        existingTask.setCompletedAt(LocalDateTime.now());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/undone")
    public ResponseEntity<Void> markTaskAsUndone(@PathVariable int id) {
        Task existingTask = findTaskById(id);
        if (existingTask == null || !existingTask.isCompleted()) {
            return ResponseEntity.ok().build(); // No error, nothing to do
        }

        existingTask.setCompleted(false);
        existingTask.setCompletedAt(null);
        return ResponseEntity.ok().build();
    }

    private Task findTaskById(int id) {
        return tasks.stream()
                .filter(task -> task.getId() == id)
                .findFirst()
                .orElse(null);
    }
}
