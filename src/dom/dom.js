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
            
                taskManager.deleteTask(index);
                if (onDeleteCallback) onDeleteCallback();
            
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

        this.createSortBar(); // calling initial sort bar creation

        // Subscribe to task manager updates
        this.taskManager.subscribe(() => {
            this.refreshView();
        });

        //initializing this as flag to keep track of sort bar status
        this.sortOrder = {
            name: true,     // true for ascending, false for descending
            priority: false,
            dueDate: true,
            project: true,
            done: true       
        };
        
        this.taskManager.sortTasks('priority',false); // my initial sort will be high to low
        // Initialize the view
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

    createSortBar(){
        const sortContainer= document.createElement('div');
        sortContainer.setAttribute('class','sort-container');
    
        const sortStatus=document.createElement('p');
        sortStatus.setAttribute('class', 'sort-item sort-status');
        sortStatus.textContent='Status';

        const sortName=document.createElement('p');
        sortName.setAttribute('class', 'sort-item sort-name');
        sortName.textContent='Name';
        sortName.addEventListener('click', () => this.toggleSort('name'));
    
        const sortPriority=document.createElement('p');
        sortPriority.setAttribute('class', 'sort-item sort-priority');
        sortPriority.textContent='Priority';
        sortPriority.addEventListener('click', () => this.toggleSort('priority'));
    
        const sortDueDate=document.createElement('p');
        sortDueDate.setAttribute('class', 'sort-item sort-duedate');
        sortDueDate.textContent='Date(YY-MM-DD)';
        sortDueDate.addEventListener('click', () => this.toggleSort('dueDate'));

    
        const sortProject=document.createElement('p');
        sortProject.setAttribute('class', 'sort-item sort-project');
        sortProject.textContent='Project';
        sortProject.addEventListener('click', () => this.toggleSort('project'));
    
        sortContainer.appendChild(sortStatus)
        sortContainer.appendChild(sortName);    
        sortContainer.appendChild(sortPriority);  
        sortContainer.appendChild(sortDueDate);  
        sortContainer.appendChild(sortProject);  

        const sortDiv=document.getElementById('sort-content');
        sortDiv.appendChild(sortContainer);

       return sortContainer;
    
    }
    
    toggleSort(criteria) {

        const currentSortCriteria=criteria;        
        // Toggle the sorting order for the given criteria
        this.sortOrder[criteria] = !this.sortOrder[criteria];

        // Call the sort function on TaskManager
        this.taskManager.sortTasks(criteria, this.sortOrder[criteria]);

        // Re-render the tasks after sorting
        this.renderTasksFiltered();

        return currentSortCriteria;
    }
    
    createTaskContainer(task, index) {
        const taskContainer = document.createElement('div');
        taskContainer.id = `task-${task.id || index}`;
        taskContainer.className = 'task-container task';
        if (task.done) {
            taskContainer.classList.add('task-done');
        }
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
        
        // Add the done-wrapper click handler
        doneWrapper.addEventListener('click', (e) => {
            // Only toggle if clicked outside the checkbox itself
            if (e.target !== doneCheckbox) {
                doneCheckbox.checked = !doneCheckbox.checked;
                this.doneCheckboxChangeHandler(task, doneCheckbox);
            }
        });

        // Add specific checkbox change handler
        doneCheckbox.addEventListener('change', () => {
            this.doneCheckboxChangeHandler(task, doneCheckbox);
        });
        
        return doneWrapper;
    }
    
    createDoneCheckbox(task, checkboxId) {
        const doneCheckbox = document.createElement('input');
        doneCheckbox.type = 'checkbox';
        doneCheckbox.checked = task.done;
        doneCheckbox.className = 'done-checkbox';
        doneCheckbox.id = checkboxId;
        
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
    
    doneCheckboxChangeHandler(task, doneCheckbox) {
        task.done = doneCheckbox.checked;
    
        // Delay sorting by 500ms (letting the checkbox animation play)
        setTimeout(() => {
            this.taskManager.sortTasks(this.currentSortCriteria, this.sortOrder[this.currentSortCriteria]); // Sort tasks after delay
            // Update task after done status change
            this.taskManager.updateTask(task.id, task);        
            
            // Update task counts in the sidebar
            this.sidebar.updateAllCounts();
        }, 500);                        
        
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
    
    
    formatDueDate(dueDate) {
        const date = new Date(dueDate);
        return date.toISOString().split('T')[0];
    }
    
    renderTasksFiltered() {
        if (this.sidebar?.currentFilter) {
            const filteredTasks = this.sidebar.currentFilter();
            console.log('Filtered Tasks:', filteredTasks);
            this.renderTasks(filteredTasks);
        }
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