class TaskManager {
    constructor() {
        this.tasks = [];
        this.subscribers = [];
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

    deleteTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
            this.notifySubscribers();
        }
    }

    getProjects() {
        return [...new Set(this.tasks.map(task => task.project))];
    }

    updateTask(index, updatedTask) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            this.notifySubscribers();
        }
    }
}

export{TaskManager}