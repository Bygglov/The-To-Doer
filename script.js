// Drag-and-Drop Todo List with Completed Tasks Section and Checkboxes

// Selecting DOM elements for tasks, inputs, and buttons
const addTaskButton = document.getElementById('add-task');
const taskInput = document.getElementById('task-input');
const todoTasks = document.getElementById('todo-tasks');
const todoList = document.getElementById('todo-list');
const completedTasks = document.getElementById('completed-tasks');
const completedList = document.getElementById('completed-list');

// Event listeners for adding tasks via button click or Enter key
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

/**
 * Allows tasks to be dragged into the To-Do section
 * @param {Event} event - Dragover event to enable dropping
 */
todoTasks.addEventListener('dragover', (event) => {
    event.preventDefault();
});

/**
 * Handles the drop event for the To-Do section
 * Moves the dragged task into the To-Do list and resets the checkbox
 * @param {Event} event - Drop event
 */
todoTasks.addEventListener('drop', (event) => {
    event.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    if (draggingItem) {
        todoList.appendChild(draggingItem);
        const checkbox = draggingItem.querySelector('.checkbox');
        if (checkbox) {
            checkbox.style.display = 'inline-block';
            checkbox.checked = false;
        }
    }
    draggingItem.classList.remove('dragging');
});

/**
 * Allows tasks to be dragged into the Completed section
 * @param {Event} event - Dragover event to enable dropping
 */
completedTasks.addEventListener('dragover', (event) => {
    event.preventDefault();
});

/**
 * Handles the drop event for the Completed section
 * Moves the dragged task into the Completed list and hides the checkbox
 * @param {Event} event - Drop event
 */
completedTasks.addEventListener('drop', (event) => {
    event.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    if (draggingItem) {
        completedList.appendChild(draggingItem);
        const checkbox = draggingItem.querySelector('.checkbox');
        if (checkbox) {
            checkbox.style.display = 'none';
        }
    }
    draggingItem.classList.remove('dragging');
});

/**
 * Adds a new task to the To-Do list
 * Validates input and appends a task item to the To-Do list
 */
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert('Please enter a task.');
        return;
    }

    const taskItem = createTaskItem(taskText);
    todoList.appendChild(taskItem);
    taskInput.value = '';
}

/**
 * Creates a new task item element
 * @param {string} taskText - Text content of the task
 * @returns {HTMLElement} - A task item element with checkbox and label
 */
function createTaskItem(taskText) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.draggable = true;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');

    // Move task to Completed section when checkbox is checked
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            taskItem.classList.add('completed-animation');
            setTimeout(() => {
                completedList.appendChild(taskItem);
                checkbox.style.display = 'none';
                taskItem.classList.remove('completed-animation');
            }, 500);
        }
    });

    // Enable drag events on the task item
    taskItem.addEventListener('dragstart', () => {
        taskItem.classList.add('dragging');
    });

    taskItem.addEventListener('dragend', () => {
        taskItem.classList.remove('dragging');
    });

    const taskLabel = document.createElement('span');
    taskLabel.textContent = taskText;

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskLabel);

    return taskItem;
}

/**
 * Determines the correct drop position during dragging
 * @param {HTMLElement} container - The container where items are being dragged
 * @param {number} y - Y-coordinate of the mouse during drag
 * @returns {HTMLElement} - The closest task item to drop before
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
