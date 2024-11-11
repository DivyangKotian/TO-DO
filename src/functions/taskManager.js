import { Task } from "./tasks";

class TaskManager {
    constructor() {
        this.subscribers = [];
        this.tasks = [];
        this.loadTasksFromStorage();
        this.currentSortCriteria = null;
        this.currentSortDirection = true; // true for ascending

        // if tasks local storage is empty generate Sameple tasks
        if (this.tasks.length === 0) {
            this.generateSampleTasks();
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
            new Task('Sketch Concept for Thesis Project', 'Initial sketches for thesis on sustainable design', '2024-11-11', '1', 'University', false),
            new Task('3D Model of Campus Library', 'Develop a 3D model of the library for portfolio', '2024-11-13', '2', 'Work', false),
            new Task('Site Visit to Construction Site', 'Document progress and take notes for studio report', '2024-11-20', '3', 'University', true),
            new Task('Client Presentation Prep', 'Prepare presentation slides for client meeting', '2024-11-30', '2', 'Work', false),
            new Task('Gather References for Studio Project', 'Collect architectural references and case studies', '2024-12-05', '1', 'University', false),
            new Task('Portfolio Update', 'Update portfolio with latest renders and design drafts', '2024-12-15', '3', 'Career', true),
            new Task('Design Review Meeting', 'Present progress on site analysis to review board', '2025-01-10', '2', 'University', false),
            new Task('Research New Building Materials', 'Explore eco-friendly materials for sustainable design', '2025-01-20', '1', 'HomeWork', true),
            new Task('Render Final Design', 'Create high-quality renderings for studio submission', '2025-02-01', '3', 'University', false),
            new Task('Site Documentation', 'Document elevations, plans, and sections on site', '2025-03-10', '3', 'Work', false),
            new Task('Prepare CAD Drawings for Renovation Project', 'Finish CAD layouts and sections for renovation', '2025-04-05', '1', 'Work', true),
            new Task('Sketch Details for Custom Furniture', 'Develop hand sketches for custom furniture design', '2025-04-20', '2', 'HomeWork', false),
            new Task('Research Internship Opportunities', 'Look up potential internships in architectural firms', '2025-05-15', '1', 'Career', true),
            new Task('Meet with Thesis Advisor', 'Discuss progress and next steps for thesis project', '2025-06-01', '2', 'University', false),
            new Task('Organize Bedroom Closet', 'Sort clothes, donate what’s not needed, and create a new storage system', '2024-11-12', '1', 'Personal', false),
            new Task('Meal Prep for the Week', 'Plan, cook, and store healthy meals for the upcoming week', '2024-11-14', '2', 'Personal', false),
            new Task('Monthly Budget Review', 'Assess last month’s expenses, adjust budget for upcoming needs', '2024-11-18', '3', 'Personal', true),
            new Task('Deep Clean Kitchen', 'Clean appliances, countertops, and cupboards; scrub sink and floors', '2024-11-21', '2', 'Personal', false),
            new Task('Start a New Book', 'Pick a new book and read at least two chapters this week', '2024-11-25', '1', 'Personal', false),
            new Task('Organize Digital Files', 'Sort through old files, delete duplicates, and back up important documents', '2024-12-05', '3', 'Personal', true)
            
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
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
                
                // Re-apply current sort if exists
                if (this.currentSortCriteria) {
                    this.sortTasks(this.currentSortCriteria, this.currentSortDirection);
                }
                
                this.saveTasksToStorage();
                this.notifySubscribers();
            }
        }

        sortTasks(criteria, ascending = true) {
            const direction = ascending ? 1 : -1;
    
            this.tasks.sort((a, b) => {
                // Always sort by done status first (unchecked/false comes before checked/true)
                const aDone = a.done !== undefined ? a.done : false;
                const bDone = b.done !== undefined ? b.done : false;
                
                if (aDone !== bDone) {
                    return aDone - bDone; // This will always put unchecked items first
                }
    
                // If done status is the same, sort by the selected criteria
                switch (criteria) {
                    case 'name':
                        return direction * a.title.localeCompare(b.title);
                    case 'priority':
                        return direction * (parseInt(a.priority) - parseInt(b.priority));
                    case 'dueDate':
                        return direction * (new Date(a.dueDate) - new Date(b.dueDate));
                    case 'project':
                        return direction * a.project.localeCompare(b.project);
                    default:
                        return 0;
                }
            });
        }

        sortWithoutReversing(criteria) {
            this.tasks.sort((a, b) => {
                // Primary sorting by done status
                const aDone = a.done !== undefined ? a.done : false;
                const bDone = b.done !== undefined ? b.done : false;
        
                if (aDone !== bDone) {
                    return aDone - bDone; // Unchecked (false) comes first without reversing
                }
        
                // Secondary sorting by selected criterion if done statuses are the same
                switch (criteria) {
                    case 'name':
                        return a.title.localeCompare(b.title); // Default ascending without reversing
                    case 'priority':
                        return parseInt(a.priority) - parseInt(b.priority);
                    case 'dueDate':
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    case 'project':
                        return a.project.localeCompare(b.project);
                    default:
                        return 0;
                }
            });
        }
        

    
}

export{TaskManager}