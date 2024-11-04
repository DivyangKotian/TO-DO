class UIElements {
    createEditButton() {
        const editBtn = document.createElement('button');
        editBtn.setAttribute('class', 'edit-button');
        const editIcon = document.createElement('i');
        editIcon.setAttribute('class', 'fa-solid fa-pen-to-square');
        editBtn.appendChild(editIcon);

        editBtn.addEventListener('click', () => {
            // Edit button functionality here
        });
        
        return editBtn;
    }

    createDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'delete-button');
        const deleteIcon = document.createElement('i');
        deleteIcon.setAttribute('class', 'fa-solid fa-trash');
        deleteBtn.appendChild(deleteIcon);

        deleteBtn.addEventListener('click', () => {
            // Delete button functionality here
        });

        return deleteBtn;
    }
}

class taskRender {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.uiElements= new UIElements();
    }

    createTaskElements(tag, textContent, className) {
        const element = document.createElement(tag);
        element.textContent = textContent;
        element.className = className;
        return element;
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

        textWrapper.appendChild(this.createTaskElements('h3', task.title, 'text-element task-title'));
        textWrapper.appendChild(this.createTaskElements('span', task.description, 'task-description'));
        textWrapper.appendChild(this.createTaskElements('span', task.priority, 'task-priority'));
        textWrapper.appendChild(this.createTaskElements('span', task.dueDate.toLocaleDateString(), 'task-date'));
        textWrapper.appendChild(this.createTaskElements('span', task.project, 'task-project'));

        doneLabel.appendChild(textWrapper);
        doneWrapper.appendChild(doneCheckbox);
        doneWrapper.appendChild(doneLabel);

        taskContainer.appendChild(doneWrapper);
        taskContainer.appendChild(this.uiElements.createEditButton());
        taskContainer.appendChild(this.uiElements.createDeleteButton());

        return taskContainer;
    }

    renderTasks(tasks) {
        this.container.textContent = ""; // Clear previous content

        tasks.forEach((task, index) => {
            const taskContainer = this.createTaskContainer(task, index);
            this.container.appendChild(taskContainer);
        });
    }
}


export{taskRender}