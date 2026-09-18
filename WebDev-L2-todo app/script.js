const STORAGE_KEY = "daymark-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const pendingList = document.querySelector("#pending-list");
const completedList = document.querySelector("#completed-list");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const pendingEmpty = document.querySelector("#pending-empty");
const completedEmpty = document.querySelector("#completed-empty");
const todayLabel = document.querySelector("#today-label");

let tasks = loadTasks();

todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric"
}).format(new Date());

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatTime(timestamp, completedAt) {
  const added = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(timestamp);
  if (!completedAt) return `Added ${added}`;
  const completed = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(completedAt);
  return `Added ${added} · Completed ${completed}`;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task-item";
  item.dataset.id = task.id;

  const toggle = document.createElement("button");
  toggle.className = `task-toggle${task.completed ? " is-complete" : ""}`;
  toggle.type = "button";
  toggle.setAttribute("aria-label", task.completed ? `Mark ${task.text} as pending` : `Mark ${task.text} as complete`);
  toggle.addEventListener("click", () => toggleTask(task.id));

  const body = document.createElement("div");
  body.className = "task-body";
  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;
  const time = document.createElement("small");
  time.className = "task-time";
  time.textContent = formatTime(task.createdAt, task.completedAt);
  body.append(text, time);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  const editButton = createActionButton("Edit", "Edit task", () => startEditing(item, task));
  const deleteButton = createActionButton("Del", "Delete task", () => deleteTask(task.id));
  actions.append(editButton, deleteButton);

  item.append(toggle, body, actions);
  return item;
}

function createActionButton(label, ariaLabel, handler) {
  const button = document.createElement("button");
  button.className = "icon-button";
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  button.addEventListener("click", handler);
  return button;
}

function renderTasks() {
  pendingList.replaceChildren();
  completedList.replaceChildren();

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  pendingTasks.forEach((task) => pendingList.appendChild(createTaskElement(task)));
  completedTasks.forEach((task) => completedList.appendChild(createTaskElement(task)));

  pendingCount.textContent = `${pendingTasks.length} pending`;
  completedCount.textContent = `${completedTasks.length} completed`;
  pendingEmpty.hidden = pendingTasks.length > 0;
  completedEmpty.hidden = completedTasks.length > 0;
}

function addTask(text) {
  tasks.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    text,
    completed: false,
    createdAt: Date.now(),
    completedAt: null
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id
    ? { ...task, completed: !task.completed, completedAt: task.completed ? null : Date.now() }
    : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function startEditing(item, task) {
  const body = item.querySelector(".task-body");
  const form = document.createElement("form");
  form.className = "edit-form";
  const input = document.createElement("input");
  input.className = "edit-input";
  input.type = "text";
  input.maxLength = 160;
  input.value = task.text;
  input.setAttribute("aria-label", "Edit task text");
  const saveButton = document.createElement("button");
  saveButton.className = "save-edit";
  saveButton.type = "submit";
  saveButton.textContent = "Save";
  form.append(input, saveButton);
  body.replaceChildren(form);
  input.focus();
  input.select();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks = tasks.map((currentTask) => currentTask.id === task.id ? { ...currentTask, text } : currentTask);
    saveTasks();
    renderTasks();
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

renderTasks();
