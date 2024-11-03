import "./styles.css";

import { TaskManager } from "./functions/taskManager";
import { Task } from "./functions/tasks";
import { renderTasks } from "./dom/dom";

const taskManager = new TaskManager();

// Add a sample task
const sampleTask = new Task(
    'Sample Task',
    'This is a sample task description.',
    new Date(), // Set due date as today's date
    'High',
    'Personal'
);

taskManager.addTask(sampleTask);

// Render tasks
renderTasks(taskManager.getTasksByProject('Personal')); // Pass the tasks to render
