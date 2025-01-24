package com.example.backend.controller;
import com.example.backend.model.Task;
import java.time.Duration;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/todos")
public class TaskController {
    
    private Map<String, Long> avgSums = new HashMap<>();
    private Map<String, Integer> avgAmounts  = new HashMap<>();
    private int currentId  =  1;
    private List<Task> tasks = new ArrayList<>(
        //UNCOMMENT THE LINE BELOW FOR SAMPLE DATA AND RESTART THE BACKEND
        //getSampleData()
    );
    
    
    public TaskController() {
        avgSums.put("avg", 0L );
        avgSums.put("Low", 0L );
        avgSums.put("Medium", 0L );
        avgSums.put("High", 0L );

        avgAmounts.put("avg",0);
        avgAmounts.put("Low",0);
        avgAmounts.put("Medium",0);
        avgAmounts.put("High",0);

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
            filteredTasks = filteredTasks.stream()
                    .filter(task -> task.isCompleted() == (state.equals("Completed")?true:false))
                    .collect(Collectors.toList());
        }

        // Filter by name
        if (name != null && !name.isEmpty()) {
            filteredTasks = filteredTasks.stream()
                    .filter(task -> task.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Filter by priority
        if (priority != null && !priority.isEmpty() && !priority.equals("All")) {
            filteredTasks = filteredTasks.stream()
                    .filter(task -> task.getPriority().equalsIgnoreCase(priority))
                    .collect(Collectors.toList());
        }

        //SORT
               // Sorting by name
        if (sortName != 0 && sortPriority == 0 && sortDueDate == 0) {
            filteredTasks = filteredTasks.stream()
                    .sorted((a, b) -> sortName == 1
                            ? a.getName().compareTo(b.getName())
                            : b.getName().compareTo(a.getName()))
                    .collect(Collectors.toList());
        }

        // Sorting by priority
        if (sortPriority != 0 && sortName == 0) {
            Map<String, List<Task>> groups = groupTasksByPriority(filteredTasks);

            // Sort within each priority group by due date, if requested
            if (sortDueDate != 0) {
                for (Map.Entry<String, List<Task>> entry : groups.entrySet()) {
                    List<Task> sortedByDate = sortByDueDate(entry.getValue(), sortDueDate);
                    groups.put(entry.getKey(), sortedByDate);
                }
            }

            // Collect tasks based on priority order
            List<Task> result = new ArrayList<>();
            if (sortPriority == 1) {
                // Ascending order for priority
                result.addAll(groups.getOrDefault("High", Collections.emptyList()));
                result.addAll(groups.getOrDefault("Medium", Collections.emptyList()));
                result.addAll(groups.getOrDefault("Low", Collections.emptyList()));
            } else {
                // Descending order for priority
                result.addAll(groups.getOrDefault("Low", Collections.emptyList()));
                result.addAll(groups.getOrDefault("Medium", Collections.emptyList()));
                result.addAll(groups.getOrDefault("High", Collections.emptyList()));
            }
            
            filteredTasks = result;
        }

        // Sorting by due date
        if (sortDueDate != 0 && sortName == 0 && sortPriority == 0 ) {
            filteredTasks = sortByDueDate(filteredTasks, sortDueDate);
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
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Map<String,String> updatedTask) {
        Task existingTask = findTaskById(id);
        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }

        if(
            updatedTask.get("name") == null ||
            updatedTask.get("name").isEmpty() || 
            updatedTask.get("priority") == null || 
            updatedTask.get("priority").isEmpty())
        return ResponseEntity.badRequest().build();


        existingTask.setName(updatedTask.get("name"));
        existingTask.setPriority(updatedTask.get("priority"));
        existingTask.setDueDate(updatedTask.get("dueDate"));

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
    public ResponseEntity<Map<String, Integer>> markTaskAsDone(@PathVariable int id) {
        Task existingTask = findTaskById(id);

        if (existingTask == null) {
            return ResponseEntity.badRequest().build();
        }

        String taskPriority = existingTask.getPriority();
        Map<String, Integer> response = new HashMap<>();
        int avgAmount, priorityAmount;
        long avgSum, prioritySum;

        if (existingTask.isCompleted()) {
            response.put("avg", 0);
            response.put("priority", 0);
            return ResponseEntity.ok(response); // No need to do anything
        }

        // Mark task as completed
        existingTask.setCompleted(true);
        existingTask.setCompletedAt(LocalDateTime.now());

        avgSum = avgSums.getOrDefault("avg", 0L);
        prioritySum = avgSums.getOrDefault(taskPriority, 0L);
        avgAmount = avgAmounts.getOrDefault("avg", 0) + 1;
        priorityAmount = avgAmounts.getOrDefault(taskPriority, 0) + 1;

        Duration duration = Duration.between(existingTask.getCreatedAt(), existingTask.getCompletedAt());
        long taskDurationMinutes = duration.toMinutes();

        avgSum += taskDurationMinutes;
        prioritySum += taskDurationMinutes;

        response.put("avg", (int) Math.ceil((double)avgSum / avgAmount));
        response.put("priority", (int) Math.ceil((double)prioritySum / priorityAmount));

        avgSums.put("avg", avgSum);
        avgSums.put(taskPriority, prioritySum);
        avgAmounts.put("avg", avgAmount);
        avgAmounts.put(taskPriority, priorityAmount);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{id}/undone")
    public ResponseEntity<Map<String, Integer>> markTaskAsUndone(@PathVariable int id) {
        Task existingTask = findTaskById(id);

        if (existingTask == null) {
            return ResponseEntity.badRequest().build();
        }

        String taskPriority = existingTask.getPriority();
        Map<String, Integer> response = new HashMap<>();
        int avgAmount, priorityAmount;
        long avgSum, prioritySum;

        if (!existingTask.isCompleted()) {
            response.put("avg", 0);
            response.put("priority", 0);
            return ResponseEntity.ok(response); // No need to do anything
        }

        // Mark task as undone
        LocalDateTime completedAt = existingTask.getCompletedAt();
        existingTask.setCompleted(false);
        existingTask.setCompletedAt(null);

        avgSum = avgSums.getOrDefault("avg", 0L);
        prioritySum = avgSums.getOrDefault(taskPriority, 0L);
        avgAmount = avgAmounts.getOrDefault("avg", 0) - 1;
        priorityAmount = avgAmounts.getOrDefault(taskPriority, 0) - 1;

        Duration duration = Duration.between(existingTask.getCreatedAt(), completedAt);
        long taskDurationMinutes = duration.toMinutes();

        avgSum -= taskDurationMinutes;
        prioritySum -= taskDurationMinutes;

        response.put("avg", avgAmount > 0 ? (int) Math.ceil( (double)avgSum / avgAmount) : 0);
        response.put("priority", priorityAmount > 0 ? (int) Math.ceil( (double) prioritySum / priorityAmount) : 0);

        avgSums.put("avg", avgSum);
        avgSums.put(taskPriority, prioritySum);
        avgAmounts.put("avg", avgAmount < 0 ? 0 : avgAmount);
        avgAmounts.put(taskPriority, priorityAmount < 0 ? 0 : priorityAmount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/average")
    public ResponseEntity<Map<String, Integer>> getAverage() {
        Map<String, Integer> response = new HashMap<>();

        response.put("avg", 
            avgAmounts.get("avg") == 0 
                ? 0 
                : (int) Math.ceil((double) avgSums.get("avg") / avgAmounts.get("avg")) );
        response.put("Low", 
            avgAmounts.get("Low") == 0 
                ? 0 
                : (int) Math.ceil((double) avgSums.get("Low") / avgAmounts.get("Low")) );        
        response.put("Medium", 
            avgAmounts.get("Medium") == 0 
                ? 0 
                : (int) Math.ceil((double) avgSums.get("Medium") / avgAmounts.get("Medium")) );   
        response.put("High", 
            avgAmounts.get("High") == 0 
                ? 0 
                : (int) Math.ceil((double) avgSums.get("High") / avgAmounts.get("High")) );   


        return ResponseEntity.ok(response);
    }


    private Task findTaskById(int id) {
        return tasks.stream()
                .filter(task -> task.getId() == id)
                .findFirst()
                .orElse(null);
    }

    // Group tasks by priority
    private Map<String, List<Task>> groupTasksByPriority(List<Task> tasks) {
        return tasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority));  // Groups by priority
    }

    // Sort tasks by due date
    private List<Task> sortByDueDate(List<Task> tasks, int sortDueDate) {
        return tasks.stream()
                .sorted((a, b) -> {
                    LocalDate dateA = a.getDueDate() == null ||
                                      a.getDueDate().isEmpty() ? 
                                        null :
                                        LocalDate.parse(a.getDueDate());
                    LocalDate dateB = b.getDueDate() == null ||
                                      b.getDueDate().isEmpty() ? 
                                        null :
                                        LocalDate.parse(b.getDueDate());

                    // Handle null dates
                    if (dateA == null && dateB == null) return 0;
                    if (dateA == null) return 1;
                    if (dateB == null) return -1;

                    return sortDueDate == 1
                            ? dateB.compareTo(dateA)  // Descending
                            : dateA.compareTo(dateB); // Ascending
                })
                .collect(Collectors.toList());
    }




    //JUST FOR DEMO PURPOSES
    private List<Task> getSampleData(){
        return new ArrayList<>(List.of(
            createTask("Task 1", "High", "2024-10-01"),
            createTask("Task 2", "Medium", "2024-10-02"),
            createTask("Task 3", "Low", "2024-10-03"),
            createTask("Task 4", "High", "2024-10-04"),
            createTask("Task 5", "Medium", "2024-10-05"),
            createTask("Task 6", "Low", "2024-10-06"),
            createTask("Task 7", "High", "2024-10-07"),
            createTask("Task 8", "Medium", "2024-10-08"),
            createTask("Task 9", "Low", "2024-10-09"),
            createTask("Task 10", "High", "2024-10-10"),
            createTask("Task 11", "Medium", "2024-10-11"),
            createTask("Task 12", "Low", "2024-10-12"),
            createTask("Task 13", "High", "2024-10-13"),
            createTask("Task 14", "Medium", "2024-10-14"),
            createTask("Task 15", "Low", "2024-10-15"),
            createTask("Task 16", "High", "2024-10-16"),
            createTask("Task 17", "Medium", "2024-10-17"),
            createTask("Task 18", "Low", "2024-10-18"),
            createTask("Task 19", "High", "2024-10-19"),
            createTask("Task 20", "Medium", "2024-10-20"),
            createTask("Task 21", "Low", "2024-10-21"),
            createTask("Task 22", "High", "2024-10-22"),
            createTask("Task 23", "Medium", "2024-10-23"),
            createTask("Task 24", "Low", "2024-10-24"),
            createTask("Task 25", "High", "2024-10-25"),
            createTask("Task 26", "Medium", "2024-10-26"),
            createTask("Task 27", "Low", "2024-10-27"),
            createTask("Task 28", "High", "2024-10-28"),
            createTask("Task 29", "Medium", "2024-10-29"),
            createTask("Task 30", "Low", "2024-10-30"),
            createTask("Task 31", "High", "2024-10-31"),
            createTask("Task 32", "Medium", ""),
            createTask("Task 33", "Low", ""),
            createTask("Task 34", "High", ""),
            createTask("Task 35", "Medium", ""),
            createTask("Task 36", "Low", ""),
            createTask("Task 37", "High", ""),
            createTask("Task 38", "Medium", ""),
            createTask("Task 39", "Low", ""),
            createTask("Task 40", "High", ""),
            createTask("Task 41", "Medium", ""),
            createTask("Task 42", "Low", ""),
            createTask("Task 43", "High", ""),
            createTask("Task 44", "Medium", ""),
            createTask("Task 45", "Low", ""),
            createTask("Task 46", "High", ""),
            createTask("Task 47", "Medium", ""),
            createTask("Task 48", "Low", ""),
            createTask("Task 49", "High", ""),
            createTask("Task 50", "Medium", ""),
            createTask("Task 51", "Low", ""),
            createTask("Task 52", "High", ""),
            createTask("Task 53", "Medium", ""),
            createTask("Task 54", "Low", ""),
            createTask("Task 55", "High", ""),
            createTask("Task 56", "Medium", ""),
            createTask("Task 57", "Low", ""),
            createTask("Task 58", "High", ""),
            createTask("Task 59", "Medium", ""),
            createTask("Task 60", "Low", ""),
            createTask("Task 61", "High", ""),
            createTask("Task 62", "Medium", ""),
            createTask("Task 63", "Low", ""),
            createTask("Task 64", "High", ""),
            createTask("Task 65", "Medium", ""),
            createTask("Task 66", "Low", ""),
            createTask("Task 67", "High", ""),
            createTask("Task 68", "Medium", ""),
            createTask("Task 69", "Low", ""),
            createTask("Task 70", "High", ""),
            createTask("Task 71", "Medium", ""),
            createTask("Task 72", "Low", ""),
            createTask("Task 73", "High", ""),
            createTask("Task 74", "Medium", ""),
            createTask("Task 75", "Low", ""),
            createTask("Task 76", "High", ""),
            createTask("Task 77", "Medium", ""),
            createTask("Task 78", "Low", ""),
            createTask("Task 79", "High", ""),
            createTask("Task 80", "Medium", ""),
            createTask("Task 81", "Low", ""),
            createTask("Task 82", "High", ""),
            createTask("Task 83", "Medium", ""),
            createTask("Task 84", "Low", ""),
            createTask("Task 85", "High", "")
        ));
    }
}
