class Modal {
    constructor(openBtnID, modalID, closeBtnID, taskManager, taskRender) {
        this.openBtn = document.getElementById(openBtnID);
        this.modal = document.getElementById(modalID);
        this.closeBtn = document.getElementById(closeBtnID);
        this.taskManager = taskManager;  // Store taskManager reference
        this.taskRender = taskRender;    // Store taskRender reference

        this.addListeners();
    }

    // Add listeners for open and close functionality
    addListeners() {
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
                this.addTask();
            });
        }
    }

    // Show modal
    showModal() {
        this.modal.classList.add('visible');
    }

    // Hide modal
    hideModal() {
        this.modal.classList.remove('visible');
        this.clearForm(); 
    }

    // Add new task
    addTask() {
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        const dueDateInput = document.getElementById('task-due-date'); 
        const priorityInput = document.getElementById('priority-slider'); 
        const projectInput = document.getElementById('project-tag'); 
    
        if (titleInput && descriptionInput && dueDateInput && priorityInput && projectInput) {
            const title = titleInput.value;
            const description = descriptionInput.value;
            const dueDate = new Date(dueDateInput.value);
            const priority = priorityInput.value; 
            const project = projectInput.value; 
    
            const newTask = new Task(title, description, dueDate, priority, project);
            this.taskManager.addTask(newTask);
            this.taskRender.renderTasks(this.taskManager.getAllTasks());
            this.clearForm();
            this.hideModal();
        } else {
            console.error('One or more input elements are not found in the DOM.');
        }
    }

    clearForm() {
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        const dueDateInput = document.getElementById('task-due-date');
        const priorityInput = document.getElementById('priority-slider');
        const projectInput = document.getElementById('project-tag');
    
        if (titleInput) titleInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        if (dueDateInput) dueDateInput.value = '';
        if (priorityInput) priorityInput.value = '1'; // low default
        if (projectInput) projectInput.value = 'General'; // default is general
    }
    
}

export{Modal}