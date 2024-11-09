class SideBar {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.taskRender = null;
        this.currentFilterType = 'all';
        this.activeElement = null; // Track the currently active element
        
        // Define static filter configurations
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
        console.log("Filter changed to:", filterType);
        console.log("Element before active:", element);
        
        this.currentFilterType = filterType;
        this.currentFilter = filterFunction;
        
        // Set active state before rendering
        this.setActiveTab(element);
        
        // Render tasks after setting active state
        requestAnimationFrame(() => {
            this.renderFilteredTasks();
        });
    }

    renderFilteredTasks() {
        if (this.taskRender?.renderTasks) {
            const filteredTasks = this.currentFilter();
            this.taskRender.renderTasks(filteredTasks);
            
            // Preserve active state after rendering
            if (this.activeElement) {
                requestAnimationFrame(() => {
                    this.activeElement.classList.add('active');
                    console.log('Restored active state after render');
                });
            }
        }
    }

    setActiveTab(selectedItem) {
        console.log('Setting active tab for:', selectedItem);
        
        // Store the previously active element
        const previousActive = this.activeElement;
        
        // Remove active class from previous element if it exists
        if (previousActive && previousActive !== selectedItem) {
            previousActive.classList.remove('active');
            console.log('Removed active from previous:', previousActive);
        }
    
        // Add active class to the selected item
        if (selectedItem) {
            selectedItem.classList.add('active');
            this.activeElement = selectedItem; // Update the active element reference
            console.log('Added active to:', selectedItem);
        }
        
        // Log the current state
        console.log('Current active element:', this.activeElement);
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

        // Store current active project if any
        const currentActiveProject = this.activeElement?.dataset?.project;

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
            
            // Restore active state if this was the active project
            if (project === currentActiveProject) {
                projectItem.classList.add('active');
                this.activeElement = projectItem;
            }
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

        // Add click handler with project-specific filter function
        projectItem.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            
            console.log('Project item clicked:', project);
            
            // Create a project-specific filter function
            const projectFilter = () => this.taskManager.getTasksByProject(project);
            
            this.handleFilterChange('project', projectFilter, projectItem);
        });

        return projectItem;
    }

    // Public method to force update everything (useful after task changes)
    refresh() {
        // Store current active element before refresh
        const currentActive = this.activeElement;
        
        this.renderFilteredTasks();
        
        // Restore active state after refresh
        if (currentActive) {
            requestAnimationFrame(() => {
                currentActive.classList.add('active');
                console.log('Restored active state after refresh');
            });
        }
    }
}

export { SideBar };