
class Task{
    constructor(title,description,dueDate,priority,project){
        this.title=title;
        this.description=description;
        this.dueDate= new Date(dueDate);
        this.priority=priority;
        this.project=project;
    }
}

export {Task};



