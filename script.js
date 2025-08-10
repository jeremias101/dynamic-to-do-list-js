document.addEventListener('DOMContentLoaded', function () {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array (keeps current state)
    let tasks = [];

    // Save the tasks array to Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a task list item and append it to the DOM
    // This isolates DOM creation so it can be reused when loading from storage
    function createTaskElement(taskText) {
        const li = document.createElement('li');

        // Task text
        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';

        // When clicked, remove the item from DOM and update Local Storage
        removeBtn.addEventListener('click', function () {
            // Remove from DOM
            taskList.removeChild(li);

            // Remove from tasks array (removes first matching entry)
            const index = tasks.indexOf(taskText);
            if (index > -1) {
                tasks.splice(index, 1);
                saveTasks();
            }
        });

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    /**
     * Add a task.
     * @param {string} [taskText] - The text of the task. If omitted, will read from input.
     * @param {boolean} [save=true] - Whether to persist the task to Local Storage.
     */
    function addTask(taskText, save = true) {
        // If no argument provided, read from input and trim
        if (typeof taskText === 'undefined') {
            taskText = taskInput.value.trim();
        } else {
            taskText = String(taskText).trim();
        }

        // Validate non-empty
        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        // Create DOM element for the task
        createTaskElement(taskText);

        // Save to in-memory array and Local Storage if requested
        if (save) {
            tasks.push(taskText);
            saveTasks();
        }

        // Clear input
        taskInput.value = '';
    }

    // Load tasks from Local Storage and populate the DOM
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // Initialize in-memory array with stored tasks
        tasks = storedTasks.slice(); // clone to be safe
        // Create DOM elements for each stored task without re-saving them
        storedTasks.forEach(taskText => addTask(taskText, false));
    }

    // Event listeners
    addButton.addEventListener('click', function () {
        addTask();
    });

    // Allow adding task with Enter key
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    // Initial load from Local Storage
    loadTasks();
});
