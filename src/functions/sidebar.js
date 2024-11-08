class SideBar {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.taskRender = null;
        this.currentFilterType = 'all';
        
        // Define filter configurations
        this.filterConfigs = {
            all: {
                selector: '.all-tasks',
                getFilteredTasks: () => this.taskManager.getAllTasks(),
            },
            completed: {
                    selector: '.completed-tasks',
                    getFilteredTasks: () => this.taskManager.getCompletedTasks(),
            },
            today: {
                selector: '.today',
                getFilteredTasks: () => this.taskManager.getTaskToday(),
            },
            week: {
                selector: '.upcoming-week',
                getFilteredTasks: () => this.taskManager.getTasksDueThisWeek(),
            },
            month: {
                selector: '.this-month',
                getFilteredTasks: () => this.taskManager.getTasksDueThisMonth(),
            },
            year: {
                selector: '.this-year',
                getFilteredTasks: () => this.taskManager.getTasksDueThisYear(),
            }
        };

        // Initialize current filter
        this.currentFilter = this.filterConfigs.all.getFilteredTasks;
        
        this.initialize();
    }

    initialize() {
        this.setupTimeBasedFilters();
        this.updateProjectList();
        // Set initial active tab
        const allTasksTab = document.querySelector(this.filterConfigs.all.selector);
        if (allTasksTab) {
            this.setActiveTab(allTasksTab);
        }
    }

    setTaskRender(taskRender) {
        this.taskRender = taskRender;
    }

    setupTimeBasedFilters() {
        Object.entries(this.filterConfigs).forEach(([filterType, config]) => {
            const element = document.querySelector(config.selector);
            if (element) {
                element.addEventListener('click', () => {
                    this.handleFilterChange(filterType, config.getFilteredTasks, element);
                });
            }
        });
    }

    handleFilterChange(filterType, filterFunction, element) {
        console.log("Filter changed to:", filterType); // Log the filter type
        this.currentFilterType = filterType;
        this.currentFilter = filterFunction;
        console.log("Activating element:", element);
        this.setActiveTab(element);
        this.renderFilteredTasks();
    }

    renderFilteredTasks() {
        if (this.taskRender?.renderTasks) {
            const filteredTasks = this.currentFilter();
            this.taskRender.renderTasks(filteredTasks);
            this.updateAllCounts();
        }
    }

    setActiveTab(selectedItem) {
        // Remove active class from time-based filters
        document.querySelectorAll('.side-bar .time-based .task-name').forEach(item => {
            item.parentElement.classList.remove('active');
        });
    
        // Remove active class from project-based filters
        document.querySelectorAll('.side-bar .project-based .project-item').forEach(item => {
            item.classList.remove('active');
        });

        console.log("Selected Item for Active Tab:", selectedItem);
        // Add active class to the selected item
        selectedItem.classList.add('active');
    }

    updateAllCounts() {
        this.updateTimeBasedCounts();
        this.updateProjectList();
    }

    updateTimeBasedCounts() {
        Object.entries(this.filterConfigs).forEach(([filterType, config]) => {
            const countElement = document.querySelector(`${config.selector} .task-count`);
            if (countElement) {
                const tasks = config.getFilteredTasks();
                const undoneTasks = tasks.filter(task => !task.done).length;
                countElement.textContent = undoneTasks;
            }
        });
    }

    updateProjectList() {
        const projectList = document.querySelector('.project-based');
        if (!projectList) return;

        // Get projects that have undone tasks
        const projectsWithTasks = new Map();
        this.taskManager.getAllTasks()
            .filter(task => !task.done)
            .forEach(task => {
                if (!projectsWithTasks.has(task.project)) {
                    projectsWithTasks.set(task.project, 1);
                } else {
                    projectsWithTasks.set(task.project, projectsWithTasks.get(task.project) + 1);
                }
            });

        // Clear and rebuild project list
        projectList.innerHTML = '';
        projectsWithTasks.forEach((count, project) => {
            const projectItem = this.createProjectItem(project, count);
            projectList.appendChild(projectItem);
        });
    }

    createProjectItem(project, count) {
        const projectItem = document.createElement('li');
        projectItem.className = 'project-item';
        projectItem.dataset.project = project;

        const projectName = document.createElement('span');
        projectName.className = 'project-name';
        projectName.textContent = project.toUpperCase();

        const taskCount = document.createElement('span');
        taskCount.className = 'task-count';
        taskCount.textContent = count;

        projectItem.appendChild(projectName);
        projectItem.appendChild(taskCount);

        // Add click handler
        projectItem.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleFilterChange(
                'project',
                () => this.taskManager.getTasksByProject(project),
                projectItem
            );
        });

        return projectItem;
    }

    // Public method to force update everything (useful after task changes)
    refresh() {
        this.renderFilteredTasks();
    }
}

export { SideBar };