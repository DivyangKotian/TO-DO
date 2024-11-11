import { Task } from "./tasks";
import { UIElements } from "../dom/dom";

class Modal {
    constructor(openBtnID, modalID, closeBtnID, taskManager,detailModalID) {
        this.openBtn = document.getElementById(openBtnID);
        this.modal = document.getElementById(modalID);
        this.closeBtn = document.getElementById(closeBtnID);
        this.taskManager = taskManager;
        this.taskRender = null; // Initialize without a reference, this is to so we can pass taskrender to modal, as modal is initialized before tassk render in my index.js
        this.detailModal=document.getElementById(detailModalID)
        this.isEditMode = false;  // Track edit mode
        this.currentTaskIndex = null; // Track task index being edited
        this.uiElements= new UIElements();
        
        this.addListeners();
    }

    // Add listeners for open and close functionality
    addListeners() {
        //event listener to update modal slider
        const prioritySlider = document.getElementById('priority-slider');
        const priorityValueDisplay = document.getElementById('priority-value');
        
        prioritySlider.addEventListener('input', () => {
            const priorityLabel = this.uiElements.getPriorityLabel(prioritySlider.value); 
            priorityValueDisplay.textContent = priorityLabel; // Updating the displayed text in the modal
        });


        this.openBtn.addEventListener('click', () => this.showModal());
        this.closeBtn.addEventListener('click', () => this.hideModal());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hideModal();
            }
        });

        // Add event listener for the submit button inside the modal
        const submitBtn = document.getElementById('btn-submit-task');
        if (submitBtn) {
            submitBtn.addEventListener('click', (event) => {
                event.preventDefault();
                if (this.isEditMode) {
                    this.editTask();  // Edit existing task
                } else {
                    this.addTask();  // Add new task
                }
            });
        }
    }

    // Show modal and set it for add or edit mode
    showModal(task = null) {
        this.modal.classList.add('visible');
        
        if (task) {  //for editing task mode
            // Populate fields for editing
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            const dueDate = new Date(task.dueDate);
            document.getElementById('task-due-date').value = dueDate.toISOString().split('T')[0];
            document.getElementById('priority-slider').value = task.priority;
            document.getElementById('project-tag').value = task.project;
            this.currentTaskId = task.id;
            
            this.isEditMode = true;
        } else {
            // Reset fields for adding a new task
            this.clearForm();
            this.isEditMode = false;
        }
    }
    // Hide modal
    hideModal() {
        this.modal.classList.remove('visible');
        this.clearForm();
        this.isEditMode = false;
    }

    
    
    // Add new task
    addTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = new Date(document.getElementById('task-due-date').value);
        const priority = document.getElementById('priority-slider').value;
        const project = document.getElementById('project-tag').value;
        const newTask = new Task(title, description, dueDate, priority, project);
        if(title && description && priority && project){
                if (isNaN(dueDate.getTime())) {         //check for valid date
                alert("Please enter a valid due date.");
                return; // Prevent form submission
            }     
            this.taskManager.addTask(newTask);
            this.taskRender.renderTasksFiltered();

            this.clearForm();
            this.hideModal();
        }
    }

    showDetailsModal(task) {
        const modal = document.getElementById('details-modal');
        document.getElementById('details-title').textContent = task.title;
        document.getElementById('details-description').textContent = task.description;
        document.getElementById('details-priority').textContent = this.uiElements.getPriorityLabel(task.priority);
        document.getElementById('details-due-date').textContent = new Date(task.dueDate).toLocaleDateString();
        document.getElementById('details-project').textContent = task.project;
        
        modal.classList.add('visible');
        
        // Close functionality for the modal
        const closeModal = document.getElementById('close-details-modal');
        closeModal.onclick = () => modal.classList.remove('visible');
        window.onclick = (event) => {
            if (event.target === modal) modal.classList.remove('visible');
        };
    }

    // Edit an existing task
    editTask() {
        // Get the task to edit using the task ID from the full list
        const task = this.taskManager.getAllTasks().find(t => t.id === this.currentTaskId);
        
        if (!task) {
            console.error('Task not found for editing');
            return;
        }
    
        // Update task fields from the modal
        task.title = document.getElementById('task-title').value;
        task.description = document.getElementById('task-description').value;
        task.dueDate = new Date(document.getElementById('task-due-date').value);
        task.priority = document.getElementById('priority-slider').value;
        task.project = document.getElementById('project-tag').value;
    
        // If all required fields are filled, update the task in the manager
        if (task.title && task.description && task.dueDate && task.priority && task.project) {
            this.taskManager.updateTask(task.id, task);  // Use the task ID for the update
    
            // Re-render the filtered tasks (if any filter is active)
            this.taskRender.renderTasksFiltered();
    
            this.clearForm();
            this.hideModal();
        } else {
            console.error('Task details are incomplete');
        }
    }

    setTaskRender(taskRender) {         // used to set the task render from null to const taskRender = new TaskRender('content', taskManager, taskModal); in index.js
        this.taskRender = taskRender;
    }

    clearForm() {
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-due-date').value = '';
        document.getElementById('priority-slider').value = '1';
        document.getElementById('project-tag').value = 'General';
        
        this.isEditMode = false;
        this.currentTaskIndex = null;
    }
}


export{Modal}