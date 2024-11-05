import { Task } from "./tasks";

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getTaskToday() {
        const today = new Date();
        return this.tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return (
                taskDate.getDate() === today.getDate() &&
                taskDate.getMonth() === today.getMonth() &&
                taskDate.getFullYear() === today.getFullYear()
            );
        });
    }

    getTasksDueThisWeek() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

        return this.tasks.filter(task => {
            return task.dueDate >= startOfWeek && task.dueDate <= endOfWeek;
        });
    }

    getTasksDueThisMonth() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return this.tasks.filter(task => {
            const taskMonth = task.dueDate.getMonth();
            const taskYear = task.dueDate.getFullYear();
            return taskMonth === currentMonth && taskYear === currentYear;
        });
    }

    getTasksDueThisYear(){
        const today=new Date();
        const currentYear= today.getFullYear();

        return this.tasks.filter(task =>{
            const taskYear=task.dueDate.getFullYear();
            return taskYear===currentYear;
        });
    }

    getTasksByProject(project) {
        return this.tasks.filter(task => task.project === project);
    }

    getAllTasks(){
        return this.tasks;
    }

    deleteTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
        } else {
            console.error('Invalid index. Task not deleted.');
        }
    }
    
    updateTask(index, updatedTask) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index] = updatedTask;
        } else {
            console.error('Invalid index. Task not updated.');
        }
    }
}

export { TaskManager };
