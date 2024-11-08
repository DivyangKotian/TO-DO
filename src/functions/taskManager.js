import { Task } from "./tasks";

class TaskManager {
    constructor() {
        this.subscribers = [];
        this.tasks = [];
        this.loadTasksFromStorage();
        if (this.tasks.length === 0) {
            this.generateSampleTasks(); // Generate sample tasks if local storage is empty
            this.saveTasksToStorage();  // Save the sample tasks to local storage
        }
    }

    loadTasksFromStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            try {
                this.tasks = JSON.parse(storedTasks);
            } catch (error) {
                console.error("Error parsing tasks from localStorage:", error);
                this.tasks = [];
            }
        }
    }

    saveTasksToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    generateSampleTasks() {
        const sampleTasks = [
            new Task('Task 1', 'Description 1', '2023-12-01', '1', 'Project A', false),
            new Task('Task 2', 'Description 2', '2023-12-10', '2', 'Project B', false),
            new Task('Task 3', 'Description 3', '2024-01-05', '3', 'Project C', true),
            new Task('Task 4', 'Description 4', '2024-02-15', '2', 'Project A', false),
            new Task('Task 5', 'Description 5', '2024-03-10', '1', 'Project B', false),
            new Task('Task 6', 'Description 6', '2024-04-20', '3', 'Project C', true),
            new Task('Task 7', 'Description 7', '2024-05-01', '2', 'Project A', false),
            new Task('Task 8', 'Description 8', '2024-05-15', '1', 'Project B', true),
            new Task('Task 9', 'Description 9', '2024-06-25', '3', 'Project C', false),
            new Task('Task 12', 'Description 12', '2024-09-10', '3', 'Project C', false),
            new Task('Task 10', 'Description 10', '2024-07-30', '1', 'Project A', true),
            new Task('Task 11', 'Description 11', '2024-08-05', '2', 'Project B', false),
            new Task('Task 13', 'Description 13', '2024-10-15', '1', 'Project A', true),
            new Task('Task 14', 'Description 14', '2024-11-01', '2', 'Project B', false)
        ];
        this.tasks.push(...sampleTasks);
    }

    // Adding observer pattern to notify components of changes
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback());
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasksToStorage();
        this.notifySubscribers();
    }

    getTaskToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        });
    }

    getTasksDueThisWeek() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const endOfWeek = new Date(today);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
    }

    getTasksDueThisMonth() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        return this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= startOfMonth && taskDate <= endOfMonth;
        });
    }

    getTasksDueThisYear() {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

        return this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= startOfYear && taskDate <= endOfYear;
        });
    }

    getTasksByProject(project) {
        return this.tasks.filter(task => task.project === project);
    }

    getAllTasks() {
        return [...this.tasks]; // Return a copy to prevent direct modification
    }

    getCompletedTasks(){
        return this.tasks.filter(task => task.done)
    }

    deleteTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
            this.saveTasksToStorage();
            this.notifySubscribers();
        }
    }

    getProjects() {
        return [...new Set(this.tasks.map(task => task.project))];
    }

    updateTask(id, updatedTask) {
        console.log('Updating Task ID:', id); 
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
            this.saveTasksToStorage();
            this.notifySubscribers();
        }
    }

    sortTasks(criteria, ascending = true) {
        const direction = ascending ? 1 : -1; // If ascending is true, direction is 1; if false, direction is -1

        this.tasks.sort((a, b) => {
            // Ensure that 'done' exists, otherwise use false (or handle the case in another way)
            const aDone = a.done !== undefined ? a.done : false;
            const bDone = b.done !== undefined ? b.done : false;

            if (criteria === 'done') {
                return direction * (aDone - bDone); // Sorting based on done status
            }

            switch (criteria) {
                case 'name':
                    return direction * a.title.localeCompare(b.title); // Sorting alphabetically by task name
                case 'priority':
                    return direction * (parseInt(a.priority) - parseInt(b.priority)); // Sorting by priority
                case 'dueDate':
                    return direction * (new Date(a.dueDate) - new Date(b.dueDate)); // Sorting by due date
                case 'project':
                    return direction * a.project.localeCompare(b.project); // Sorting by project name
                default:
                    return 0; // No sorting if criteria doesn't match
            }
        });
    }
    
}

export{TaskManager}