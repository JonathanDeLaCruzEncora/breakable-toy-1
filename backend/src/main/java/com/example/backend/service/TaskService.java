package com.example.backend.service;

import com.example.backend.model.Task;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private int currentId = 1;
    public List<Task> tasks = new ArrayList<>();

    /**
     * Finds a task by its ID.
     *
     * @param id the ID of the task to find
     * @return the task with the specified ID, or null if not found
     */
    public Task findTaskById(int id) {
        return tasks.stream()
                .filter(task -> task.getId() == id)
                .findFirst()
                .orElse(null);
    }

    /**
     * Groups tasks by their priority.
     *
     * @param tasks the list of tasks to group
     * @return a map where the keys are priorities and the values are lists of tasks with that priority
     */
    public Map<String, List<Task>> groupTasksByPriority(List<Task> tasks) {
        return tasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority));
    }

    /**
     * Sorts tasks by their due date.
     *
     * @param tasks the list of tasks to sort
     * @param sortDueDate the sorting order (1 for ascending, -1 for descending)
     * @return the sorted list of tasks
     */
    
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

    /**
     * Filters tasks based on various criteria.
     *
     * @param tasks the list of tasks to filter
     * @param state the state to filter by (optional)
     * @param name the name to filter by (optional)
     * @param priority the priority to filter by (optional)
     * @param completed the completion status to filter by (optional)
     * @return the filtered list of tasks
     */
    public List<Task> filterTasks(List<Task> tasks, String state, String name, String priority, Boolean completed) {
        return tasks.stream()
            .filter(task -> (state == null || state.isEmpty() || state.equals("All") || task.isCompleted() == state.equals("Completed")))
            .filter(task -> (name == null || name.isEmpty() || task.getName().toLowerCase().contains(name.toLowerCase())))
            .filter(task -> (priority == null || priority.isEmpty() || priority.equals("All") || task.getPriority().equalsIgnoreCase(priority)))
            .collect(Collectors.toList());
    }

    /**
     * Paginates a list of tasks.
     *
     * @param tasks the list of tasks to paginate
     * @param page the page number to retrieve
     * @param size the number of tasks per page
     * @return the paginated list of tasks
     */
    public List<Task> paginateTasks(List<Task> tasks, int page, int size) {
        int start = (page < 0 ? 0 : page ) * size;
        int end = Math.min(start + size, tasks.size());
        return tasks.subList(start, end);
    }

    /**
     * Sorts tasks based on various criteria.
     *
     * @param tasks the list of tasks to sort
     * @param sortName the sorting order for name (1 for ascending, -1 for descending)
     * @param sortPriority the sorting order for priority (1 for ascending, -1 for descending)
     * @param sortDueDate the sorting order for due date (1 for ascending, -1 for descending)
     * @return the sorted list of tasks
     */
    public List<Task> sortTasks(List<Task> tasks, int sortName, int sortPriority, int sortDueDate) {
        List<Task> sortedTasks = tasks;

        // Sorting by name
        if (sortName != 0 && sortPriority == 0 && sortDueDate == 0) {
            sortedTasks = sortedTasks.stream()
                    .sorted((a, b) -> sortName == 1
                            ? a.getName().compareTo(b.getName())
                            : b.getName().compareTo(a.getName()))
                    .collect(Collectors.toList());
        }

        // Sorting by priority
        if (sortPriority != 0 && sortName == 0) {
            Map<String, List<Task>> groups = groupTasksByPriority(sortedTasks);

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

            sortedTasks = result;
        }

        // Sorting by due date
        if (sortDueDate != 0 && sortName == 0 && sortPriority == 0) {
            sortedTasks = sortByDueDate(sortedTasks, sortDueDate);
        }

        return sortedTasks;
    }

    /**
     * Changes the completion status of a task and updates average values.
     *
     * @param existingTask the task to update
     * @param avgSums the map of average sums
     * @param avgAmounts the map of average amounts
     * @param toCompleted the new completion status
     * @return a map containing the updated average values
     */
    public Map<String, Integer> changeCompletion(Task existingTask, Map<String, Long> avgSums, Map<String, Integer> avgAmounts, boolean toCompleted) {
        String taskPriority = existingTask.getPriority(); 
        Map<String, Integer> response = new HashMap<>();
        int avgAmount, priorityAmount;
        long avgSum, prioritySum;
        
        LocalDateTime completedAt = toCompleted ? LocalDateTime.now() : existingTask.getCompletedAt();
        existingTask.setCompleted(toCompleted);
        existingTask.setCompletedAt(toCompleted ? LocalDateTime.now() : null);

        avgSum = avgSums.getOrDefault("avg", 0L);
        prioritySum = avgSums.getOrDefault(taskPriority, 0L);
        avgAmount = avgAmounts.getOrDefault("avg", 0) + (toCompleted ? 1: -1);
        priorityAmount = avgAmounts.getOrDefault(taskPriority, 0) + (toCompleted ? 1: -1);

        Duration duration = Duration.between(existingTask.getCreatedAt(), completedAt);
        long taskDurationMinutes = duration.toMinutes();

        avgSum += toCompleted ? taskDurationMinutes : -taskDurationMinutes;
        prioritySum += toCompleted ? taskDurationMinutes : -taskDurationMinutes;

        response.put("avg", avgAmount > 0 ? (int) Math.ceil( (double)avgSum / avgAmount) : 0);
        response.put("priority", priorityAmount > 0 ? (int) Math.ceil( (double) prioritySum / priorityAmount) : 0);

        avgSums.put("avg", avgSum);
        avgSums.put(taskPriority, prioritySum);
        avgAmounts.put("avg", avgAmount > 0 ? avgAmount : 0);
        avgAmounts.put(taskPriority, priorityAmount > 0 ? priorityAmount : 0);
        
        return response;
    }

    /**
     * Creates a new task.
     *
     * @param name the name of the task
     * @param priority the priority of the task
     * @param dueDate the due date of the task
     * @return the created task
     */
    public Task createTask(String name, String priority, String dueDate) {
        Task task = new Task();
        task.setId(currentId++);
        task.setCompleted(false);
        task.setName(name);
        task.setPriority(priority);
        task.setDueDate(dueDate);
        task.setCreatedAt(LocalDateTime.now());
        task.setCompletedAt(null);

        tasks.add(task);
        return task;
    }

    /**
     * Deletes a task by its ID.
     *
     * @param id the ID of the task to delete
     */
    public void deleteTask(int id) {
        tasks.removeIf(task -> task.getId() == id);
    }

    /**
     * Retrieves tasks sorted by their creation date in descending order.
     *
     * @return the sorted list of tasks
     */
    public List<Task> getTasksSortedByCreatedAt() {
        return tasks.stream()
            .sorted(Comparator.comparing(Task::getCreatedAt).reversed()) // Reverses the comparator
            .collect(Collectors.toList());
    }
}

