import "./styles.css";
import "./style/modal.css";
import "./style/taskcontainer.css"
import "./style/sidebar.css"
import "./style/checkbox.css"

import { TaskManager } from "./functions/taskManager";
import { Task } from "./functions/tasks";
import { TaskRender } from "./dom/dom";
import { Modal } from "./functions/sidebar";

const taskManager = new TaskManager();
const taskModal = new Modal('btn-add-task', 'modal', 'close-modal', taskManager,'details-modal'); 

//at this point taskRender is null, but since I need to create a modal to send to taskRender, so after taskRender is initialized, set it again in our modal class, basically taaskModal and taskRender are interlinked

const taskRender = new TaskRender('content', taskManager, taskModal);       

// Pass the TaskRender instance to the modal for rendering tasks
taskModal.setTaskRender(taskRender);        

// Add a sample task
const sampleTask = new Task(
    'Sample Task',
    'This is a sample task description.',
    new Date(), // Set due date as today's date
    '1',
    'Personal'
);

const sampleTask2 = new Task('second task', 'New description, ill try to make it a little longer', '2025-11-11', '2', 'Work');

taskManager.addTask(sampleTask);
taskManager.addTask(sampleTask2);

taskRender.renderTasks(taskManager.getAllTasks());
