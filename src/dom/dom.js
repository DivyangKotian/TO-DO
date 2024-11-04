import { TaskManager } from "../functions/taskManager";

class UIElements {
    createEditButton(task, index, onEdit) {
        const editBtn = document.createElement('button');
        editBtn.setAttribute('class', 'edit-button');
        const editIcon = document.createElement('i');
        editIcon.setAttribute('class', 'fa-solid fa-pen-to-square');
        editBtn.appendChild(editIcon);

        editBtn.addEventListener('click', () => {
            // Call the edit function and pass task and index
            onEdit(task, index);
        });
        
        return editBtn;
    }

    createDeleteButton(taskManager, index, renderTasksCallback) {
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'delete-button');
        const deleteIcon = document.createElement('i');
        deleteIcon.setAttribute('class', 'fa-solid fa-trash');
        deleteBtn.appendChild(deleteIcon);
    
        deleteBtn.addEventListener('click', () => {
            taskManager.deleteTask(index);
            renderTasksCallback(taskManager.getAllTasks());
        });
    
        return deleteBtn;
    }
}

class TaskRender {
    constructor(containerId, taskManager) {
        this.container = document.getElementById(containerId);
        this.taskManager = taskManager; 
        this.uiElements = new UIElements();
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

    createTaskContainer(task, index) {
        const taskContainer = document.createElement('div');
        taskContainer.id = `task-${index}`;
        taskContainer.className = 'task-container task';
        
        // Checkbox and label wrapper
        const doneWrapper = document.createElement('div');
        doneWrapper.className = 'done-wrapper';

        const doneCheckbox = document.createElement('input');
        doneCheckbox.type = 'checkbox';
        doneCheckbox.checked = task.done;
        doneCheckbox.className = 'done-checkbox';

        const checkboxId = `check-${task.title.replace(/\s+/g, '-')}-${index}`;
        doneCheckbox.id = checkboxId;

        const doneLabel = document.createElement('label');
        doneLabel.setAttribute('for', checkboxId);

        const textWrapper = document.createElement('div');
        textWrapper.className = 'text-wrapper';

        textWrapper.appendChild(this.createTaskTitle(task.title, 'text-element task-title'));
        textWrapper.appendChild(this.createTaskElements('span', task.description, 'task-description'));
        textWrapper.appendChild(this.createTaskElements('span', task.priority, 'task-priority'));
        textWrapper.appendChild(this.createTaskElements('span', task.dueDate.toLocaleDateString(), 'task-date'));
        textWrapper.appendChild(this.createTaskElements('span', task.project, 'task-project'));

        doneLabel.appendChild(textWrapper);
        doneWrapper.appendChild(doneCheckbox);
        doneWrapper.appendChild(doneLabel);

        taskContainer.appendChild(doneWrapper);
        taskContainer.appendChild(this.uiElements.createEditButton(task, index, this.onEdit.bind(this))); 
        taskContainer.appendChild(this.uiElements.createDeleteButton(this.taskManager, index, this.renderTasks.bind(this)));

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

        // Handle form submission for editing (You need to implement this part)
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

            modal.classList.remove('visible'); // Close modal after editing
        };
    }

  renderTasks(tasks) {
        this.container.textContent = ""; 

        tasks.forEach((task, index) => {
            const taskContainer = this.createTaskContainer(task, index);
            this.container.appendChild(taskContainer);
        });
    }
}


export{TaskRender}