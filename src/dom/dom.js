function createTaskElements(el, textCon, className) {
    const taskElement = document.createElement(el);
    taskElement.textContent = textCon;
    taskElement.setAttribute('class', className);
    return taskElement; 
}

function createTaskContainer(task, index) {
    const taskContainer = document.createElement('div');
    taskContainer.setAttribute('id', index);
    taskContainer.setAttribute('class', 'task-container task');

    taskContainer.appendChild(createTaskElements('h1', task.title, 'task-title'));
    taskContainer.appendChild(createTaskElements('h3', task.description, 'task-description'));
    taskContainer.appendChild(createTaskElements('span', task.priority, 'task-priority'));

    const formattedDate = task.dueDate.toLocaleDateString();
    taskContainer.appendChild(createTaskElements('span', formattedDate, 'task-date')); // Changed 'date' to 'span'

    taskContainer.appendChild(createTaskElements('p', task.project, 'task-project'));

    const container = document.getElementById('content');
    container.appendChild(taskContainer); // Append to the content container
}

function renderTasks(tasks) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = ""; // Clear previous content

    tasks.forEach((task, index) => {
        createTaskContainer(task, index);
    });
}

export { renderTasks };
