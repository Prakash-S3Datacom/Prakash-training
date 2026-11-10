// STEP 1: Select HTML elements

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");


// STEP 2: Listen for form submission

taskForm.addEventListener("submit", function(event) {

    // Prevent page reload
    event.preventDefault();

    // Get input value
    const taskName = taskInput.value.trim();

    // Check empty input
    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    // STEP 3: Create new HTML element

    const li = document.createElement("li");

    // Create task text
    const span = document.createElement("span");

    span.textContent = taskName;

    // Create buttons
    const completeButton = document.createElement("button");

    completeButton.textContent = "Complete";
    completeButton.classList.add("complete-btn");

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    // Create action container
    const actions = document.createElement("div");

    actions.classList.add("actions");

    actions.append(completeButton, deleteButton);

    // Add elements to li
    li.append(span, actions);

    // Add li to task list
    taskList.appendChild(li);

    // Clear input
    taskInput.value = "";

    // Update task count
    updateTaskCount();

});


// STEP 4: Event Delegation

taskList.addEventListener("click", function(event) {

    // Check Complete button
    if (event.target.classList.contains("complete-btn")) {

        const li = event.target.closest("li");

        const taskText = li.querySelector("span");

        taskText.classList.toggle("completed");

    }

    // Check Delete button
    if (event.target.classList.contains("delete-btn")) {

        const li = event.target.closest("li");

        li.remove();

        updateTaskCount();

    }

});


// STEP 5: Update task count

function updateTaskCount() {

    const totalTasks = taskList.children.length;

    taskCount.textContent = totalTasks;

}