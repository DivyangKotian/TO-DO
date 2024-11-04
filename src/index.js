import "./styles.css";
import "./style/modal.css"

import { TaskManager } from "./functions/taskManager";
import { Task } from "./functions/tasks";
import { TaskRender } from "./dom/dom";
import { Modal } from "./functions/sidebar";

const taskManager = new TaskManager();
const ui= new TaskRender("content");
const taskRender = new TaskRender('task-container-id', taskManager);
const taskModal = new Modal('btn-add-task', 'modal', 'close-modal', taskManager, ui);

// Add a sample task
const sampleTask = new Task(
    'Sample Task',
    'This is a sample task description.',
    new Date(), // Set due date as today's date
    'High',
    'Personal'
);

const sampleTask2= new Task('second task','New description, ill try to make it a little longer', '2025-11-11', 'Low', 'Work');

taskManager.addTask(sampleTask);
taskManager.addTask(sampleTask2);


ui.renderTasks(taskManager.getAllTasks());


// Render tasks
// ui.renderTasks(taskManager.getTasksByProject('Personal')); 
