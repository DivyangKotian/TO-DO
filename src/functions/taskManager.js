class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
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
}

export { TaskManager };
