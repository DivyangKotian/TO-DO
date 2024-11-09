import "./styles.css";
import "./style/modal.css";
import "./style/taskcontainer.css";
import "./style/sidebar.css";
import "./style/checkbox.css";
import "./style/sortbar.css"
import "./style/variables.css"

import { TaskManager } from "./functions/taskManager";
import { TaskRender } from "./dom/dom";
import { Modal } from "./functions/modal";
import { SideBar } from "./functions/sidebar";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize TaskManager
    const taskManager = new TaskManager();

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
