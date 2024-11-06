
class SideBar {
    constructor(taskManager) {
        console.log(taskManager);
        this.taskManager = taskManager;
        console.log("taskManager in SideBar constructor:", this.taskManager);
    }

    setTaskRender(taskRender) {             // this will be used to pass an instance of renderTask method from TaskRender class
        this.taskRender = taskRender;
    }

    updateProjectList() {
        const projectList = document.querySelector('.project-based');
        projectList.innerHTML = '';

        const uniqueProjects = [...new Set(this.taskManager.getAllTasks().map(task => task.project))];

        uniqueProjects.forEach(project => {
            const projectItem = document.createElement('li');
            projectItem.setAttribute('class', 'project-item');

            const projectName = document.createElement('span');
            projectName.setAttribute('class', 'project-name');
            projectName.textContent = project;

            const taskCount = document.createElement('span');
            taskCount.setAttribute('class', 'task-count');

            projectItem.appendChild(projectName);
            projectItem.appendChild(taskCount);

            projectItem.addEventListener('click', () => {
                this.filterTasksByProject(project);
            });

            projectList.appendChild(projectItem);
        });

        this.updateTaskCounts(); // Call to update the counts
    }

    filterTasksByProject(project) {
        const filteredTasks = this.taskManager.getTasksByProject(project);
        if (this.renderTaskCallback && typeof this.renderTaskCallback === 'function') {
            this.renderTaskCallback(filteredTasks);
        } else {
            console.error("renderTaskCallback is not set or not a function.");
        }
    }

    updateTaskCounts() {
        document.querySelector('.all-tasks .task-count').textContent = this.taskManager.getAllTasks().filter(task => !task.done).length;
        document.querySelector('.today .task-count').textContent = this.taskManager.getTaskToday().filter(task => !task.done).length;
        document.querySelector('.upcomming-week .task-count').textContent = this.taskManager.getTasksDueThisWeek().filter(task => !task.done).length;
        document.querySelector('.this-month .task-count').textContent = this.taskManager.getTasksDueThisMonth().filter(task => !task.done).length;
        document.querySelector('.this-year .task-count').textContent = this.taskManager.getTasksDueThisYear().filter(task => !task.done).length;

        const uniqueProjects = [...new Set(this.taskManager.getAllTasks().map(task => task.project))];

        uniqueProjects.forEach(project => {
            const projectTask = this.taskManager.getTasksByProject(project);
            const projectTaskCount = projectTask.filter(task => !task.done).length;

            const projectItems = document.querySelectorAll('.project-item .project-name');
            let projectItem = null;

            projectItems.forEach(item => {
                if (item.textContent.trim() === project) {
                    projectItem = item;
                    if (projectItem) {
                        const taskCountSpan = projectItem.nextElementSibling;
                        taskCountSpan.textContent = projectTaskCount;
                    }
                }
            });
        });
    }
}

export { SideBar };
