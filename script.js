document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskCategory = document.getElementById('task-category');
    const taskList = document.getElementById('task-list');
    const registerSection = document.getElementById('register-section');
    const loginSection = document.getElementById('login-section');
    const taskSection = document.getElementById('task-section');
    const logoutBtn = document.getElementById('logout-btn');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const taskSearchInput = document.getElementById('task-search');

    let tasks = [];

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(user => user.username === username)) {
            alert('Username already exists!');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful!');
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            loginSection.style.display = 'none';
            taskSection.style.display = 'block';
            logoutBtn.style.display = 'block';
            loadTasks(username);
        } else {
            alert('Invalid Username/Password!\n Try Again');
        }
    });

    logoutBtn.addEventListener('click', () => {
        taskSection.style.display = 'none';
        loginSection.style.display = 'block';
        logoutBtn.style.display = 'none';
        clearLoginForm();
    });

    const clearLoginForm = () => {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    };

    const loadTasks = (username) => {
        tasks = JSON.parse(localStorage.getItem(username + '-tasks')) || [];
        renderTasks(tasks);
    };

    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <span class="task-category">[${task.category}]</span>
                <div class="task-actions">
                    <button class="edit-task">Edit</button>
                    <button class="delete-task">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    const saveTasks = (username) => {
        localStorage.setItem(username + '-tasks', JSON.stringify(tasks));
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value;
        const category = taskCategory.value;
        const username = document.getElementById('username').value;
        if (task) {
            tasks.push({ text: task, category: category });
            renderTasks(tasks);
            taskInput.value = '';
            saveTasks(username);
        }
    });

    taskList.addEventListener('click', (e) => {
        const username = document.getElementById('username').value;
        if (e.target.classList.contains('delete-task')) {
            const taskIndex = e.target.closest('li').dataset.index;
            tasks.splice(taskIndex, 1);
            renderTasks(tasks);
            saveTasks(username);
        } else if (e.target.classList.contains('edit-task')) {
            const taskIndex = e.target.closest('li').dataset.index;
            const newText = prompt('Edit Task', tasks[taskIndex].text);
            if (newText !== null) {
                tasks[taskIndex].text = newText;
                renderTasks(tasks);
                saveTasks(username);
            }
        }
    });

    const searchTasks = (query) => {
        const filteredTasks = tasks.filter(task =>
            task.text.toLowerCase().includes(query.toLowerCase()) ||
            task.category.toLowerCase().includes(query.toLowerCase())
        );
        renderTasks(filteredTasks);
    };

    taskSearchInput.addEventListener('input', () => {
        const searchQuery = taskSearchInput.value.trim();
        searchTasks(searchQuery);
    });
});
