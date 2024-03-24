document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('taskList');
    const toggleThemeButton = document.getElementById('toggleTheme');
    const searchInput = document.getElementById('searchInput');
    const tagFilter = document.getElementById('tagFilter');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Toggle Night Mode
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
  
    // Display Tasks
    const displayTasks = (filteredTasks = tasks) => {
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('li');
            taskElement.innerHTML = 
          
          `<div class="box-container">
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
                </div>`;
            taskList.appendChild(taskElement);
        });
    };

    // Add Task
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

    // Delete Task
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        updateLocalStorage();
        displayTasks();
 
    };

    // Update Local Storage


    // Show Edit Modal
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
    

    // Close modal when the user clicks on <span> (x)
    document.querySelector('.close').onclick = function() {
        document.getElementById('editTaskModal').style.display = 'none';
    };

    // Close modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == document.getElementById('editTaskModal')) {
            document.getElementById('editTaskModal').style.display = 'none';
        }
    };

    // Search Tasks
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.name.toLowerCase().includes(searchTerm)
        );
        displayTasks(filteredTasks);
    });

    // Filter by Tags
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

    // Initial Render
    displayTasks();
});