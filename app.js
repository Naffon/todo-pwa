document.addEventListener("DOMContentLoaded", loadTodos);

const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");

addButton.addEventListener("click", addTodo);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const task = input.value.trim();
    if (!task) return;

    const todoItem = createTodoElement(task);
    todoList.appendChild(todoItem);
    
    saveTodos();
    input.value = "";
}

function createTodoElement(task) {
    const li = document.createElement("li");
    li.textContent = task;
    li.draggable = true;

    // Drag & Drop functionality
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    li.addEventListener("dragend", saveTodos);

    return li;
}

function saveTodos() {
    const todos = [...document.querySelectorAll("li")].map(li => li.textContent);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(task => todoList.appendChild(createTodoElement(task)));
}

// Drag & Drop Functions
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    setTimeout(() => this.style.display = "none", 0);
}

function dragOver(e) {
    e.preventDefault();
}

function drop() {
    if (draggedItem !== this) {
        let items = [...document.querySelectorAll("li")];
        let draggedIndex = items.indexOf(draggedItem);
        let droppedIndex = items.indexOf(this);

        if (draggedIndex < droppedIndex) {
            this.after(draggedItem);
        } else {
            this.before(draggedItem);
        }
    }
}

function dragEnd() {
    this.style.display = "block";
    saveTodos();
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.log('SW Registration Failed:', err));
}