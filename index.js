const todoInput = document.querySelector("#todo-name");
const submitButton = document.querySelector("#submit-btn");
const todoForm = document.querySelector("form");
const todoListElement = document.querySelector("#todo-list");
const doneListElement = document.querySelector("#done-list");
const todoListButton = document.querySelector("#todo-list-btn");
const doneListButton = document.querySelector("#done-list-btn");
const todoCountDisplay = document.querySelector("#todo-quantity");
const doneCountDisplay = document.querySelector("#done-quantity");

let todoItems = [];
let doneItems = [];
let isEditingTask = false; // Flag to check if editing a task title
let taskToEditIndex; // Variable to track the task's index to be edited

// Renders list upon page load
updateTodoList();

function updateTodoList() {
	todoCountDisplay.textContent = `TODO (${todoItems.length})`;
	doneCountDisplay.textContent = `DONE (${doneItems.length})`;
	renderTodoList();
	renderDoneList();
}

// Adds functionality to the form
todoForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!todoInput.value) return;
	if (isEditingTask) {
		todoItems[taskToEditIndex].title = todoInput.value.trim();
		renderTodoList();
		submitButton.textContent = "Add";
		isEditingTask = false;
	} else {
		addTask(todoInput.value.trim());
	}
	todoInput.value = "";
});

function addTask(title) {
	todoItems.push({ title, isDone: false });
	updateTodoList();
}

function removeTask(index) {
	if (isEditingTask) return;
	todoItems.splice(index, 1);
	updateTodoList();
}

function removeDoneTask(index) {
	doneItems.splice(index, 1);
	updateTodoList();
}

// Declares the function to edit a task
function editTask(index) {
	renderTodoList(); // Re-render to potentially show editing styles
	const taskItem = todoListElement.querySelectorAll("li")[index];
	taskItem.style.borderBottom = ".25rem solid #2a2a2a"; // Highlight editing task
	isEditingTask = true;
	todoInput.focus();
	todoInput.value = todoItems[index].title;
	submitButton.textContent = "Edit";
	taskToEditIndex = index;
}

function markAsDone(index) {
	if (isEditingTask) return;
	if (index >= 0 && index < todoItems.length) {
		const task = todoItems[index];
		if (!task.isDone) {
			task.isDone = true;
			doneItems.push(task);
			todoItems.splice(index, 1);
		} else {
			task.isDone = false;
			doneItems.splice(doneItems.indexOf(task), 1);
			todoItems.push(task);
		}
		updateTodoList();
	} else {
		console.error("Invalid task index provided.");
	}
}

function markAsNotDone(index) {
	if (index >= 0 && index < doneItems.length) {
		const task = doneItems[index];
		if (task.isDone) {
			task.isDone = false;
			todoItems.push(task);
			doneItems.splice(index, 1);
		}
		updateTodoList();
	} else {
		console.error("Invalid task index provided.");
	}
}

// Attaches functionality to buttons after rendering a list
function addTodoButtonEvents() {
	const markAsDoneButtons = document.querySelectorAll("[data-mark-done]");
	const editButtons = document.querySelectorAll("[data-edit]");
	const deleteButtons = document.querySelectorAll("[data-delete]");

	deleteButtons.forEach((button, index) => {
		button.addEventListener("click", () => {
			removeTask(index);
		});
	});

	editButtons.forEach((button, index) => {
		button.addEventListener("click", () => {
			editTask(index);
		});
	});
	markAsDoneButtons.forEach((btn, index) => {
		btn.addEventListener("click", () => {
			markAsDone(index);
		});
	});
}

function addDoneButtonEvents() {
	const markAsDoneButtons = document.querySelectorAll("[data-mark-not-done]");
	const deleteButtons = document.querySelectorAll("[data-delete-done]");

	deleteButtons.forEach((button, index) => {
		button.addEventListener("click", () => {
			removeDoneTask(index);
		});
	});

	markAsDoneButtons.forEach((btn, index) => {
		btn.addEventListener("click", () => {
			markAsNotDone(index);
		});
	});
}

function renderTodoList() {
	let todoListHTML = "";
	if (todoItems.length === 0) {
		todoListElement.innerHTML = `<h2 class="text-lg font-medium">No tasks yet...</h2>`;
	} else {
		todoItems.forEach((task) => {
			todoListHTML += `
        <li
          class="flex items-center justify-between gap-2 p-2 rounded-md shadow-md"
        >
          <h3
            title="${task.title}"
            class="text-lg font-medium text-nowrap text-ellipsis line-clamp-1"
          >
            ${task.title}
          </h3>
          <div class="flex gap-2">
            <input 
              data-mark-done
              ${task.isDone ? "checked" : ""}
              title="Mark as done"
              type="checkbox"
              class="w-4 aspect-square"
            />
            <button
              data-edit
              title="Edit task"
              class="rounded text-white bg-neutral-950 w-8 aspect-square transition-colors hover:bg-slate-800"
            >
              <i class="fa-solid fa-pen"></i>
            </button>
            <button
              data-delete
              title="Delete task"
              class="rounded text-white bg-neutral-950 w-8 aspect-square transition-colors hover:bg-slate-800"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </li>
      `;
		});
		todoListElement.innerHTML = todoListHTML;
		addTodoButtonEvents();
	}
}

function renderDoneList() {
	let doneListHTML = "";
	if (doneItems.length === 0) {
		doneListElement.innerHTML = `<h2 class="text-lg font-medium">No tasks yet...</h2>`;
	} else {
		doneItems.forEach((task) => {
			doneListHTML += `
        <li
          class="flex items-center justify-between gap-2 p-2 rounded-md shadow-md"
        >
          <h3
            title="${task.title}"
            class="text-lg font-medium text-nowrap text-ellipsis line-clamp-1"
          >
            ${task.title}
          </h3>
          <div class="flex gap-2">
            <input 
              data-mark-not-done
              ${task.isDone ? "checked" : ""}
              title="Mark as not done"
              type="checkbox"
              class="w-4 aspect-square"
            />
            <button
              data-delete-done
              title="Delete task"
              class="rounded text-white bg-neutral-950 w-8 aspect-square transition-colors hover:bg-slate-800"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </li>
      `;
		});
		doneListElement.innerHTML = doneListHTML;
		addDoneButtonEvents();
	}
}

function toggleButtonBorder(activeButton, inactiveButton) {
	activeButton.classList.add("border-neutral-950");
	inactiveButton.classList.remove("border-neutral-950");
	inactiveButton.classList.remove("border-neutral-950/10");
}

todoListButton.addEventListener("click", () => {
	toggleButtonBorder(todoListButton, doneListButton);
	doneListElement.classList.toggle("flex");
	doneListElement.classList.add("hidden");
	todoListElement.classList.remove("hidden");
	todoListElement.classList.add("flex");
});

doneListButton.addEventListener("click", () => {
	toggleButtonBorder(doneListButton, todoListButton);
	todoListElement.classList.remove("flex");
	todoListElement.classList.add("hidden");
	doneListElement.classList.remove("hidden");
	doneListElement.classList.add("flex");
});
