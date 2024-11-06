import { SideBar } from "../functions/sidebar";

class UIElements {
    createEditButton(task, index, modal) {
        const editBtn = document.createElement('button');
        editBtn.setAttribute('class', 'edit-button button');
        const editIcon = document.createElement('i');
        editIcon.setAttribute('class', 'fa-solid fa-pen-to-square');
        editBtn.appendChild(editIcon);

        editBtn.addEventListener('click', () => {
            // Open the modal in edit mode
            modal.showModal(task, index);
        });
        
        return editBtn;
    }

    createDeleteButton(taskManager, index, renderTasksCallback) {
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'delete-button button');
        const deleteIcon = document.createElement('i');
        deleteIcon.setAttribute('class', 'fa-solid fa-trash');
        deleteBtn.appendChild(deleteIcon);
    
        deleteBtn.addEventListener('click', () => {
            if (taskManager && typeof taskManager.deleteTask === 'function') {
                taskManager.deleteTask(index);
                renderTasksCallback(taskManager.getAllTasks());
            } else {
                console.error("taskManager or deleteTask method is undefined.");
            }
        });
    
        return deleteBtn;
    }

    createDetailsButton(task,detailsModal){
        const detailsBtn=document.createElement('button');
        detailsBtn.setAttribute('class','details-button button');
        const detailsIcon=document.createElement('i');
        detailsIcon.setAttribute('class','fa-solid fa-arrow-down');
        detailsBtn.appendChild(detailsIcon);

        detailsBtn.addEventListener('click', () => {
            detailsModal.showDetailsModal(task);
        });

        return detailsBtn;
    }

    getPriorityLabel(priorityValue) {           //converting 1,2,3 to low med high
        switch (priorityValue) {
            case '1':
                return 'Low';
            case '2':
                return 'Med';
            case '3':
                return 'High';
            default:
                return ''; // In case of unexpected values
        }
    }
}

class TaskRender {
    constructor(containerId, taskManager,modal) {
        this.container = document.getElementById(containerId);
        this.taskManager = taskManager; 
        this.uiElements = new UIElements();
        this.modal=modal;
        this.sidebar = new SideBar(this.taskManager);
        this.sidebar.setTaskRender(this.renderTasks.bind(this));

    }

    createTaskElements(tag, textContent, className) {
        const element = document.createElement(tag);
        element.textContent = textContent;
        element.className = className;
        return element;
    }

    createTaskTitle(textContent, className) {
        const taskTitle = document.createElement('h3');
        taskTitle.textContent = textContent.toUpperCase();
        taskTitle.setAttribute('class', className);
        return taskTitle;
    }


    // adding classes for css styling
    applyPriorityClass(taskContainer, priority) {
        // Remove any existing priority class
        taskContainer.classList.remove('task-priority-low', 'task-priority-medium', 'task-priority-high');

        switch (priority) {
            case '1':
                taskContainer.classList.add('task-priority-low');
                break;
            case '2':
                taskContainer.classList.add('task-priority-medium');
                break;
            case '3':
                taskContainer.classList.add('task-priority-high');
                break;
            default:
                console.warn('Unexpected priority value:', priority);
        }
    }

    createTaskContainer(task, index) {
        const taskContainer = document.createElement('div');
        taskContainer.id = `task-${index}`;
        taskContainer.className = 'task-container task';
        console.log("TaskManager in createTaskContainer:", this.taskManager); // Should be a valid TaskManager instance
        // Checkbox and label wrapper
        const doneWrapper = document.createElement('div');
        doneWrapper.className = 'done-wrapper';

        const doneCheckbox = document.createElement('input');
        const checkboxId = `check-${task.title.replace(/\s+/g, '-')}-${index}`;
        doneCheckbox.type = 'checkbox';
        doneCheckbox.checked = task.done;
        doneCheckbox.className = 'done-checkbox';
        
        //event listner for the checkbox
        doneCheckbox.addEventListener('change', () => {
            task.done = doneCheckbox.checked;  // Update task 'done' status
            this.taskManager.updateTask(index, task);  // Update task in TaskManager
            this.sidebar.updateTaskCounts(); // to update the sidebar number
        });
        
        doneCheckbox.id = checkboxId;
        const doneLabel = document.createElement('label');
        doneLabel.setAttribute('for', checkboxId);
        
        const textWrapper = document.createElement('div');
        textWrapper.className = 'text-wrapper';

        //append required elements to the container
        textWrapper.appendChild(this.createTaskTitle(task.title, 'text-element task-title'));
        textWrapper.appendChild(this.createTaskElements('span', task.description, 'task-description'));
        textWrapper.appendChild(this.createTaskElements('span', this.uiElements.getPriorityLabel(task.priority), 'task-priority'));
        
        //call function to apply css classes based on priority
        this.applyPriorityClass(taskContainer, task.priority);

        textWrapper.appendChild(this.createTaskElements('span', task.dueDate.toLocaleDateString(), 'task-date'));
        textWrapper.appendChild(this.createTaskElements('span', task.project, 'task-project'));

        doneLabel.appendChild(textWrapper);
        doneWrapper.appendChild(doneCheckbox);
        doneWrapper.appendChild(doneLabel);

        taskContainer.appendChild(doneWrapper);
        taskContainer.appendChild(this.uiElements.createEditButton(task, index, this.modal)); 
        taskContainer.appendChild(this.uiElements.createDeleteButton(this.taskManager, index, this.renderTasks.bind(this)));

        taskContainer.appendChild(this.uiElements.createDetailsButton(task, this.modal));

        console.log("Returning taskContainer:", taskContainer);  // Should log a proper div element

    
        return taskContainer;
    }

    onEdit(task, index) {
        const modal = document.getElementById('modal');
        // Populate modal with task details
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('project-tag').value=task.project;
        document.getElementById('priority-slider').value = task.priority; // Assume you have a way to handle this
        document.querySelector('.due-date-input').value = task.dueDate.toISOString().split('T')[0]; // Set due date input
        modal.classList.add('visible');

        // Handle form submission for editing 
        const form = document.querySelector('.form-add-task');
        form.onsubmit = (e) => {
            e.preventDefault();
            task.title = form['task-title'].value;
            task.description = form['task-description'].value;
            task.priority = form['priority-slider'].value;
            task.dueDate = new Date(form['due-date'].value);
            task.project=form['project-tag'].value;
            this.taskManager.updateTask(index, task);

            this.renderTasks(this.taskManager.getAllTasks());
            console.log("Render tasks called with updated tasks:", this.taskManager.getAllTasks());
            
            modal.classList.remove('visible'); // Close modal after editing
        };
    }
    
    renderTasks(tasks) {
        this.container.textContent = ""; 
        
        tasks.forEach((task, index) => {
            const taskContainer = this.createTaskContainer(task, index);
            this.container.appendChild(taskContainer);
        });
        
        this.sidebar.updateTaskCounts();
        this.sidebar.updateProjectList();
    }
}


export{TaskRender, UIElements}