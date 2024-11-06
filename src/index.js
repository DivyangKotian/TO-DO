import "./styles.css";
import "./style/modal.css";
import "./style/taskcontainer.css"
import "./style/sidebar.css"
import "./style/checkbox.css"

import { TaskManager } from "./functions/taskManager";
import { Task } from "./functions/tasks";
import { TaskRender } from "./dom/dom";
import { Modal } from "./functions/modal";
import { SideBar } from "./functions/sidebar";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize taskManager
    const taskManager = new TaskManager();

    // Add tasks
    const sampleTask = new Task('Sample Task', 'This is a sample task description.', new Date(), '1', 'Personal');
    const sampleTask2 = new Task('second task', 'New description', '2025-11-11', '2', 'Work');
    taskManager.addTask(sampleTask);
    taskManager.addTask(sampleTask2);

    // Initialize taskModal and taskRender
    const taskModal = new Modal('btn-add-task', 'modal', 'close-modal', taskManager, 'details-modal');
    const taskRender = new TaskRender('content', taskManager, taskModal);

    // Pass taskRender to taskModal
    taskModal.setTaskRender(taskRender);

    // Initialize the sidebar with taskManager and taskRender
    const sidebar = new SideBar(taskManager);
    sidebar.setTaskRender(taskRender)
    taskRender.renderTasks(taskManager.getAllTasks());
});

// Call renderTasks if required
