const taskInput = document.querySelector('#taskInput');
const addTaskButton = document.querySelector('#addTaskButton');
const selectAllTasksCheckbox = document.querySelector('#selectAllTasks');
const taskList = document.querySelector('#taskList');
const clearCompletedButton = document.querySelector('#clearCompletedButton');
const storageKey = 'todo-tasks';

function saveTasks() {
	const tasks = [...taskList.querySelectorAll('li')].map((item) => ({
git 		description: item.querySelector('span').textContent,
		completed: item.querySelector('input').checked,
	}));

	localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function updateSelectAllTasksCheckbox() {
	const checkboxes = [...taskList.querySelectorAll('input[type="checkbox"]')];
	const completedCount = checkboxes.filter((checkbox) => checkbox.checked).length;

	selectAllTasksCheckbox.disabled = checkboxes.length === 0;
	selectAllTasksCheckbox.checked = checkboxes.length > 0 && completedCount === checkboxes.length;
	selectAllTasksCheckbox.indeterminate = completedCount > 0 && completedCount < checkboxes.length;
}

function renderTask(description, completed = false) {
	const item = document.createElement('li');
	const label = document.createElement('label');
	const checkbox = document.createElement('input');
	const text = document.createElement('span');

	checkbox.type = 'checkbox';
	checkbox.checked = completed;
	text.textContent = description;
	label.append(checkbox, text);
	item.append(label);
	item.classList.toggle('completed', completed);

	checkbox.addEventListener('change', () => {
		item.classList.toggle('completed', checkbox.checked);
		updateSelectAllTasksCheckbox();
		saveTasks();
	});

	taskList.append(item);
	updateSelectAllTasksCheckbox();
}

function loadTasks() {
	try {
		const tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');

		if (Array.isArray(tasks)) {
			tasks.forEach((task) => {
				if (typeof task.description === 'string') {
					renderTask(task.description, Boolean(task.completed));
				}
			});
		}
	} catch {
		localStorage.removeItem(storageKey);
	}
}

function addTask() {
	const description = taskInput.value.trim();

	if (!description) {
		taskInput.focus();
		return;
	}

	renderTask(description);
	saveTasks();
	taskInput.value = '';
	taskInput.focus();
}

addTaskButton.addEventListener('click', addTask);

selectAllTasksCheckbox.addEventListener('change', () => {
	taskList.querySelectorAll('li').forEach((item) => {
		const checkbox = item.querySelector('input[type="checkbox"]');
		checkbox.checked = selectAllTasksCheckbox.checked;
		item.classList.toggle('completed', checkbox.checked);
	});
	updateSelectAllTasksCheckbox();
	saveTasks();
});

taskInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		addTask();
	}
});

clearCompletedButton.addEventListener('click', () => {
	const completedTasks = taskList.querySelectorAll('.completed');

	if (completedTasks.length === 0) {
		alert('Você não selecionou nenhum item!');
		return;
	}

	completedTasks.forEach((item) => item.remove());
	updateSelectAllTasksCheckbox();
	saveTasks();
});

loadTasks();
