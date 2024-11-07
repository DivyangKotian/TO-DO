class UIElements {
    createEditButton(task, index, modal) {
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-button button';
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pen-to-square';
        editBtn.appendChild(editIcon);

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            modal.showModal(task, index);
        });
        
        return editBtn;
    }

    createDeleteButton(taskManager, index, onDeleteCallback) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button button';
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash';
        deleteBtn.appendChild(deleteIcon);
    
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this task?')) {
                taskManager.deleteTask(index);
                if (onDeleteCallback) onDeleteCallback();
            }
        });
    
        return deleteBtn;
    }

    createDetailsButton(task, detailsModal) {
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'details-button button';
        
        const detailsIcon = document.createElement('i');
        detailsIcon.className = 'fa-solid fa-arrow-down';
        detailsBtn.appendChild(detailsIcon);

        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            detailsModal.showDetailsModal(task);
        });

        return detailsBtn;
    }

    getPriorityLabel(priority) {
        const priorityMap = {
            '1': 'Low',
            '2': 'Medium',
            '3': 'High'
        };
        return priorityMap[priority] || 'Unknown';
    }
}

class TaskRender {
    constructor(containerId, taskManager, modal, sidebar) {
        this.container = document.getElementById(containerId);
        this.taskManager = taskManager;
        this.uiElements = new UIElements();
        this.modal = modal;
        this.sidebar = sidebar;
        this.currentTasks = [];

        // Subscribe to task manager updates
        this.taskManager.subscribe(() => {
            this.refreshView();
        });

        // Initialize the view
        this.refreshView();
    }

    refreshView() {
        const filteredTasks = this.sidebar.currentFilter();
        this.renderTasks(filteredTasks);
        this.sidebar.updateAllCounts();
    }

    createTaskElements(tag, textContent, className) {
        const element = document.createElement(tag);
        element.textContent = textContent;
        element.className = className;
        return element;
    }

    createTaskContainer(task, index) {
        const taskContainer = document.createElement('div');
        taskContainer.id = `task-${task.id || index}`;
        taskContainer.className = 'task-container task';
        this.applyPriorityClass(taskContainer, task.priority);

        const doneWrapper = this.createDoneWrapper(task, index);
        const buttonWrapper = this.createButtonWrapper(task, index);

        taskContainer.appendChild(doneWrapper);
        taskContainer.appendChild(buttonWrapper);

        return taskContainer;
    }

    createDoneWrapper(task, index) {
        const doneWrapper = document.createElement('div');
        doneWrapper.className = 'done-wrapper';

        const checkboxId = `check-${task.title.replace(/\s+/g, '-')}-${index}`;
        const doneCheckbox = this.createDoneCheckbox(task, index, checkboxId);
        const doneLabel = this.createDoneLabel(task, checkboxId);

        doneWrapper.appendChild(doneCheckbox);
        doneWrapper.appendChild(doneLabel);

        return doneWrapper;
    }

    createDoneCheckbox(task, index, checkboxId) {
        const doneCheckbox = document.createElement('input');
        doneCheckbox.type = 'checkbox';
        doneCheckbox.checked = task.done;
        doneCheckbox.className = 'done-checkbox';
        doneCheckbox.id = checkboxId;

        doneCheckbox.addEventListener('change', () => {
            this.doneCheckboxChangeHandler(task, index, doneCheckbox);
        });

        return doneCheckbox;
    }

    createDoneLabel(task, checkboxId) {
        const doneLabel = document.createElement('label');
        doneLabel.setAttribute('for', checkboxId);

        const textWrapper = document.createElement('div');
        textWrapper.className = 'text-wrapper';

        const formattedDate = this.formatDueDate(task.dueDate);

        const elements = [
            { tag: 'h3', text: task.title.toUpperCase(), class: 'text-element task-title' },
            { tag: 'span', text: task.description, class: 'task-description' },
            { tag: 'span', text: this.uiElements.getPriorityLabel(task.priority), class: 'task-priority' },
            { tag: 'span', text: formattedDate, class: 'task-date' },
            { tag: 'span', text: task.project.toUpperCase(), class: 'task-project' }
        ];

        elements.forEach(el => {
            textWrapper.appendChild(this.createTaskElements(el.tag, el.text, el.class));
        });

        doneLabel.appendChild(textWrapper);
        return doneLabel;
    }

    createButtonWrapper(task, index) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';

        buttonWrapper.appendChild(this.uiElements.createEditButton(task, index, this.modal));
        buttonWrapper.appendChild(this.uiElements.createDeleteButton(this.taskManager, index, () => this.refreshView()));
        buttonWrapper.appendChild(this.uiElements.createDetailsButton(task, this.modal));

        return buttonWrapper;
    }

    applyPriorityClass(taskContainer, priority) {
        const priorityClasses = {
            '1': 'task-priority-low',
            '2': 'task-priority-medium',
            '3': 'task-priority-high'
        };

        Object.values(priorityClasses).forEach(cls => {
            taskContainer.classList.remove(cls);
        });

        const className = priorityClasses[priority];
        if (className) {
            taskContainer.classList.add(className);
        }
    }

    doneCheckboxChangeHandler(task, index, doneCheckbox) {
        task.done = doneCheckbox.checked;
        this.taskManager.updateTask(index, task);
    }

    formatDueDate(dueDate) {
        const date = new Date(dueDate);
        return date.toISOString().split('T')[0];
    }

    renderTasks(tasks) {
        this.container.innerHTML = '';
        this.currentTasks = tasks;

        tasks.forEach((task, index) => {
            const taskContainer = this.createTaskContainer(task, index);
            this.container.appendChild(taskContainer);
        });
    }
}


export{TaskRender, UIElements}