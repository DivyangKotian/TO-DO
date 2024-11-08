import "./styles.css";
import "./style/modal.css";
import "./style/taskcontainer.css";
import "./style/sidebar.css";
import "./style/checkbox.css";
import "./style/sortbar.css"

import { TaskManager } from "./functions/taskManager";
import { Task } from "./functions/tasks";
import { TaskRender } from "./dom/dom";
import { Modal } from "./functions/modal";
import { SideBar } from "./functions/sidebar";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize TaskManager
    const taskManager = new TaskManager();

    // Sample Tasks (for testing)
    // const sampleTask = new Task('Sample Task', 'This is a sample task description.', new Date(), '1', 'Personal');
    // const sampleTask2 = new Task('Second Task', 'New description', '2025-11-08', '2', 'Work');
    // const sampleTask3 = new Task('thirds Task', 'Newer description', '2025-11-19', '3', 'Home');
    // const sampleTask4 = new Task('fourth Task', 'Newest description', '2024-01-01', '1', 'University');
    // const sampleTask5 = new Task('fifth Task', 'Newester description', '2024-05-05', '1', 'General');
    // taskManager.addTask(sampleTask);
    // taskManager.addTask(sampleTask2);
    // taskManager.addTask(sampleTask3);
    // taskManager.addTask(sampleTask4);
    // taskManager.addTask(sampleTask5);

    // Initialize Modal
    const sidebar = new SideBar(taskManager);
    const taskModal = new Modal('btn-add-task', 'modal', 'close-modal', taskManager, 'details-modal');
    const taskRender = new TaskRender('content', taskManager, taskModal, sidebar);
    // Pass TaskRender to Modal and Sidebar
    sidebar.setTaskRender(taskRender);
    taskModal.setTaskRender(taskRender);

    // Render initial tasks
    taskRender.renderTasks(taskManager.getAllTasks());
});
