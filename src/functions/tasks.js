
class Task{
    constructor(title,description,dueDate,priority,project,done){
        this.title=title;
        this.description=description;
        this.dueDate= new Date(dueDate);
        this.priority=priority;
        this.project=project;
        this.done=done;
        this.id = Math.floor(Math.random() * 1000000);
        this.class="task";
    }

}

export {Task};



