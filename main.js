const taskInput = document.querySelector('#taskInput');
const addTaskButton = document.querySelector('#addTaskButton');
const selectAllTasksCheckbox = document.querySelector('#selectAllTasks');
const taskList = document.querySelector('#taskList');
const storageKey = 'todo-tasks';

function saveTasks() {
	const tasks = [...taskList.querySelectorAll('li')].map((item) => ({
		description: item.querySelector('span').textContent,
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
	const actions = document.createElement('div');
	const editButton = document.createElement('button');
	const editIcon = document.createElement('img');
	const deleteButton = document.createElement('button');
	const deleteIcon = document.createElement('img');

	checkbox.type = 'checkbox';
	checkbox.checked = completed;
	text.className = 'task-description';
	text.textContent = description;
	label.append(checkbox, text);

	actions.className = 'task-actions';
	editButton.type = 'button';
	editButton.className = 'task-action task-edit';
	editButton.setAttribute('aria-label', `Editar tarefa: ${description}`);
	editIcon.src = 'img/icon-edit.png';
	editIcon.alt = '';
	editIcon.setAttribute('aria-hidden', 'true');
	editButton.append(editIcon);

	deleteButton.type = 'button';
	deleteButton.className = 'task-action task-delete';
	deleteButton.setAttribute('aria-label', `Remover tarefa: ${description}`);
	deleteIcon.src = 'img/icons8-remove-94.png';
	deleteIcon.alt = '';
	deleteIcon.setAttribute('aria-hidden', 'true');
	deleteButton.append(deleteIcon);

	actions.append(editButton, deleteButton);
	item.append(label, actions);
	item.classList.toggle('completed', completed);

	checkbox.addEventListener('change', () => {
		item.classList.toggle('completed', checkbox.checked);
		updateSelectAllTasksCheckbox();
		saveTasks();
	});

	editButton.addEventListener('click', () => {
		const updatedDescription = prompt('Edite a tarefa:', text.textContent);

		if (updatedDescription === null) {
			return;
		}

		const trimmedDescription = updatedDescription.trim();

		if (!trimmedDescription) {
			return;
		}

		text.textContent = trimmedDescription;
		editButton.setAttribute('aria-label', `Editar tarefa: ${trimmedDescription}`);
		deleteButton.setAttribute('aria-label', `Remover tarefa: ${trimmedDescription}`);
		saveTasks();
	});

	deleteButton.addEventListener('click', () => {
		item.remove();
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

loadTasks();
