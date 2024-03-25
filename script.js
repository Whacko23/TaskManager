document.addEventListener('DOMContentLoaded', () => {
  const addTaskForm = document.getElementById('addTaskForm');
  const taskList = document.getElementById('taskList');
  const toggleThemeButton = document.getElementById('toggleTheme');
  const searchInput = document.getElementById('searchInput');
  const tagFilter = document.getElementById('tagFilter');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  toggleThemeButton.addEventListener('click', () => {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
      body.removeAttribute('data-theme');
      toggleThemeButton.textContent = 'Night Mode: Off';
    } else {
      body.setAttribute('data-theme', 'dark');
      toggleThemeButton.textContent = 'Night Mode: On';
    }
  });

  const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const displayTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
      const taskElement = document.createElement('li');
      taskElement.classList.add(`${task.priority.toLowerCase()}-priority`);
      taskElement.innerHTML = `
        <div class="box-container">
          <h3 class="box-title">${task.name}</h3>
          <p><strong>Due Date:</strong> ${task.dueDate}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>
          <p><strong>Status:</strong> ${task.status}</p>
          <p><strong>Tags:</strong> ${task.category}</p>
          <div class="actions">
            <button class="edit-btn" onclick="showEditModal('${index}')">Edit</button>
            <button class="delete-btn" onclick="deleteTask('${index}')">Delete</button>
            <button class="complete-btn" onclick="completeTask('${index}')">Complete</button>
          </div>
        </div>
      `;
      taskList.appendChild(taskElement);
    });
  };

  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
      name: document.getElementById('taskName').value,
      dueDate: document.getElementById('dueDate').value,
      priority: document.getElementById('priority').value,
      category: document.getElementById('category').value,
      status: 'Pending'
    };
    tasks.push(newTask);
    updateLocalStorage();
    displayTasks();
    addTaskForm.reset();
  });

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    updateLocalStorage();
    displayTasks();
  };

  window.showEditModal = (index) => {
    const task = tasks[index];
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editDueDate').value = task.dueDate;
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editCategory').value = task.category;
    document.getElementById('editStatus').value = task.status;

    const modal = document.getElementById('editTaskModal');
    modal.style.display = 'block';

    const editForm = document.getElementById('editTaskForm');
    editForm.onsubmit = (e) => {
      e.preventDefault();
      updateTask(index);
      modal.style.display = 'none';
    };
  };

  const updateTask = (index) => {
    const task = tasks[index];
    task.name = document.getElementById('editTaskName').value;
    task.dueDate = document.getElementById('editDueDate').value;
    task.priority = document.getElementById('editPriority').value;
    task.category = document.getElementById('editCategory').value;
    task.status = document.getElementById('editStatus').value;

    updateLocalStorage();
    displayTasks();
  };

  document.querySelector('.close').onclick = function() {
    document.getElementById('editTaskModal').style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == document.getElementById('editTaskModal')) {
      document.getElementById('editTaskModal').style.display = 'none';
    }
  };

  window.completeTask = (index) => {
    tasks[index].status = 'Completed';
    updateLocalStorage();

    const selectedTag = tagFilter.value;
    if (selectedTag === 'All') {
      displayTasks();
    } else if (selectedTag === 'Completed') {
      const completedTasks = tasks.filter(task => task.status === 'Completed');
      displayTasks(completedTasks);
    } else if (selectedTag === 'Pending') {
      const pendingTasks = tasks.filter(task => task.status === 'Pending');
      displayTasks(pendingTasks);
    } else {
      const filteredTasks = tasks.filter(task => task.category === selectedTag);
      displayTasks(filteredTasks);
    }
  };

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm)
    );
    displayTasks(filteredTasks);
  });

  tagFilter.addEventListener('change', () => {
    const selectedTag = tagFilter.value;
    if (selectedTag === 'All') {
      displayTasks();
    } else if (selectedTag === 'Completed') {
      const completedTasks = tasks.filter(task => task.status === 'Completed');
      displayTasks(completedTasks);
    } else if (selectedTag === 'Pending') {
      const pendingTasks = tasks.filter(task => task.status === 'Pending');
      displayTasks(pendingTasks);
    } else {
      const filteredTasks = tasks.filter(task => task.category === selectedTag);
      displayTasks(filteredTasks);
    }
  });

  displayTasks();
});
