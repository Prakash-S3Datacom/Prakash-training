
import type { Todo } from "./types/Todo.js";

// STEP 1: Select HTML elements

const taskForm = document.querySelector<HTMLFormElement>("#taskForm");
const taskInput = document.querySelector<HTMLInputElement>("#taskInput");
const taskList = document.querySelector<HTMLUListElement>("#taskList");
const taskCount = document.querySelector<HTMLElement>("#taskCount");

// STEP 2: Check HTML elements

if (!taskForm || !taskInput || !taskList || !taskCount) {
    throw new Error("Required HTML elements are missing");
}

const form = taskForm;
const input = taskInput;
const list = taskList;
const count = taskCount;

// STEP 3: Create typed Todo array

let todos: Todo[] = [];

// STEP 4: Listen for form submission

taskForm.addEventListener("submit", (event: SubmitEvent): void => {

    event.preventDefault();

    const taskName: string = taskInput.value.trim();

    // Validate input
    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    // Create a new Todo object
    const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: taskName,
        completed: false,
        createdAt: new Date().toISOString()
    };

    // Add Todo to array
    todos.push(newTodo);

    // Clear input
    taskInput.value = "";

    // Update UI
    renderTodos();
});

// STEP 5: Render Todo tasks

function renderTodos(): void {

  list.replaceChildren();

    todos.forEach((todo: Todo): void => {

        const li: HTMLLIElement = document.createElement("li");

        // Task text
        const span: HTMLSpanElement = document.createElement("span");

        span.textContent = todo.title;

        if (todo.completed) {
            span.classList.add("completed");
        }

        // Complete button
        const completeButton: HTMLButtonElement =
            document.createElement("button");

        completeButton.textContent = todo.completed ? "Undo" : "Complete";
        completeButton.classList.add("complete-btn");

        completeButton.dataset.id = todo.id;
        completeButton.dataset.action = "toggle";

        // Delete button
        const deleteButton: HTMLButtonElement =
            document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        deleteButton.dataset.id = todo.id;
        deleteButton.dataset.action = "delete";

        // Action container
        const actions: HTMLDivElement = document.createElement("div");

        actions.classList.add("actions");

        actions.append(completeButton, deleteButton);

        li.append(span, actions);
list.appendChild(li);
    });

    updateTaskCount();
}

// STEP 6: Event delegation

taskList.addEventListener("click", (event: MouseEvent): void => {

    const target = event.target;

    if (!(target instanceof Element)) {
        return;
    }

    const button = target.closest("button[data-action]");

    if (!(button instanceof HTMLButtonElement)) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (!id || !action) {
        return;
    }

    // Complete or undo task
    if (action === "toggle") {

        todos = todos.map((todo: Todo): Todo => {

            if (todo.id === id) {
                return {
                    ...todo,
                    completed: !todo.completed
                };
            }

            return todo;
        });
    }

    // Delete task
    if (action === "delete") {

        todos = todos.filter((todo: Todo): boolean => {
            return todo.id !== id;
        });
    }

    renderTodos();
});

// STEP 7: Update task count

function updateTaskCount(): void {

    const totalTasks: number = todos.length;

    count.textContent = String(totalTasks);
}

// Initial rendering
renderTodos();
