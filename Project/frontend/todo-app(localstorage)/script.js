
// STEP 1: Select HTML elements

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");


// STEP 2: Load tasks from localStorage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// STEP 3: Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// STEP 4: Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        const span = document.createElement("span");

        span.textContent = task.name;

        if (task.completed) {
            span.classList.add("completed");
        }

        const completeButton = document.createElement("button");

        completeButton.textContent = "Complete";
        completeButton.classList.add("complete-btn");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        const actions = document.createElement("div");

        actions.classList.add("actions");

        actions.append(completeButton, deleteButton);

        li.append(span, actions);

        taskList.appendChild(li);

    });

    updateTaskCount();

}
// STEP 5: Listen for form submission

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    // Create task object
    const newTask = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    // Add task to array
    tasks.push(newTask);

    // Save and display
    saveTasks();
    renderTasks();

    taskInput.value = "";

});


// STEP 6: Event Delegation

taskList.addEventListener("click", function(event) {

    const li = event.target.closest("li");

    if (!li) return;

    const taskId = Number(li.dataset.id);

    // Complete button
    if (event.target.classList.contains("complete-btn")) {

        const task = tasks.find(function(task) {
            return task.id === taskId;
        });

        if (task) {
            task.completed = !task.completed;
        }

        saveTasks();
        renderTasks();

    }

    // Delete button
    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(function(task) {
            return task.id !== taskId;
        });

        saveTasks();
        renderTasks();

    }

});


// STEP 7: Update task count

function updateTaskCount() {

    taskCount.textContent = tasks.length;

}


// STEP 8: Load saved tasks when page opens

renderTasks();
