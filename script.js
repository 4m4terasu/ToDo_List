let categoryCount = 5; // Maximum allowed categories including the main one
let currentCategory = "Main"; // Default category is "Main"
let categoryNames = []; // Array to store created categories

function filterTasks(category) {
    currentCategory = category;
    loadTasks(); // Load tasks for the selected category

    // Update the category name displayed in the todo-container
    document.getElementById("categoryName").textContent = category;

    const buttons = document.querySelectorAll('.category');
    buttons.forEach(button => {
        if (button.textContent.trim() === category) {
            button.classList.add('active-category');
        } else {
            button.classList.remove('active-category');
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('night-mode');
    document.querySelector('.todo-container').classList.toggle('night-mode');
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(`tasks_${currentCategory}`)) || [];
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear the task list before adding new tasks
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function saveTasks() {
    const tasks = Array.from(document.querySelectorAll('.task-text')).map(task => task.textContent);
    localStorage.setItem(`tasks_${currentCategory}`, JSON.stringify(tasks));
}

function addTaskToDOM(taskText) {
    const taskList = document.getElementById("taskList");
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskTextNode = document.createElement("div");
    taskTextNode.classList.add("task-text");
    taskTextNode.textContent = taskText;

    const completeBtn = document.createElement("div");
    completeBtn.classList.add("complete-btn");
    completeBtn.onclick = function() {
        completeTask(taskItem, completeBtn);
    };

    taskItem.appendChild(taskTextNode);
    taskItem.appendChild(completeBtn);

    taskList.appendChild(taskItem);

    saveTasks();
}

document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    const taskList = document.getElementById("taskList");

    if (taskText === "") return;

    if (taskList.children.length < 10) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskTextNode = document.createElement("div");
        taskTextNode.classList.add("task-text");
        taskTextNode.textContent = taskText;

        const completeBtn = document.createElement("div");
        completeBtn.classList.add("complete-btn");
        completeBtn.onclick = function() {
            completeTask(taskItem, completeBtn);
        };

        taskItem.appendChild(taskTextNode);
        taskItem.appendChild(completeBtn);

        taskList.appendChild(taskItem);

        taskInput.value = "";
        taskInput.focus();

        saveTasks();
    } else {
        alert("Maximum task limit reached (10 tasks).");
    }
}

function completeTask(taskItem, completeBtn) {
    if (!completeBtn.classList.contains("completed")) {
        completeBtn.classList.add("completed");
        let removeTask = true;
        setTimeout(function() {
            if (removeTask) {
                taskItem.remove();
                saveTasks();
            }
        }, 1777);

        completeBtn.addEventListener("click", function() {
            removeTask = false;
            completeBtn.classList.remove("completed");
            saveTasks();
        }, {once: true});
    } else {
        completeBtn.classList.remove("completed");
        saveTasks();
    }
}

function addCategory() {
    const currentCategoryCount = categoryNames.length;
    if (currentCategoryCount >= 5) {
        alert("You already have the maximum number of categories.");
        return;
    }

    const categoryName = prompt("Enter category name:");
    if (categoryName) {
        if (categoryName.length > 20) {
            alert("Category name cannot exceed 20 characters.");
            return;
        }
        const taskBar = document.querySelector('.task-bar');
        // Check if the category already exists
        if (!categoryNames.includes(categoryName)) {
            const newButton = document.createElement('button');
            newButton.classList.add('category');
            newButton.onclick = function() {
                filterTasks(categoryName);
            };
            newButton.innerHTML = `
                ${getCategoryIcon()} 
                <span class="category-text">${categoryName}</span>
                <button class="delete-category" onclick="deleteCategory('${categoryName}')">Delete</button>
            `;
            taskBar.appendChild(newButton);
            categoryNames.push(categoryName); // Add category name to array

            // Update category count and save categories
            saveCategories();
        } else {
            alert("Category already exists.");
        }
    }
}

function deleteCategory(categoryName) {
    const taskBar = document.querySelector('.task-bar');
    const buttons = taskBar.querySelectorAll('.category');

    for (let i = 0; i < buttons.length; i++) {
        const categoryText = buttons[i].querySelector('.category-text').textContent;
        if (categoryText === categoryName) {
            taskBar.removeChild(buttons[i]);
            const index = categoryNames.indexOf(categoryName);
            if (index !== -1) {
                categoryNames.splice(index, 1); // Remove category name from array
            }
            localStorage.removeItem(`tasks_${categoryName}`); // Remove tasks data for the deleted category

            // Update category count and save categories
            saveCategories();
            break; // Stop loop once the category is deleted
        }
    }
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categoryNames));
}

function loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categoryNames = JSON.parse(storedCategories);
        categoryNames.forEach(category => {
            addCategoryButton(category);
        });
    }
}

function addCategoryButton(categoryName) {
    const taskBar = document.querySelector('.task-bar');
    const newButton = document.createElement('button');
    newButton.classList.add('category');
    newButton.onclick = function() {
        filterTasks(categoryName);
        highlightActiveCategory(newButton); // Highlight the active category
    };
    newButton.innerHTML = `
        <span class="category-text">${categoryName}</span>
        <button class="delete-category" onclick="deleteCategory('${categoryName}')">Delete</button>
    `;
    taskBar.appendChild(newButton);

    // Check if this is the active category and highlight it
    if (categoryName === currentCategory) {
        highlightActiveCategory(newButton);
    }
}

function getCategoryIcon() {
    // Return an empty string, as you don't want any icon
    return '';
}

function addCategoryButton(categoryName) {
    const taskBar = document.querySelector('.task-bar');
    const newButton = document.createElement('button');
    newButton.classList.add('category');
    newButton.onclick = function() {
        filterTasks(categoryName);
        highlightActiveCategory(newButton); // Highlight the active category
    };
    newButton.innerHTML = `
        <span class="category-text">${categoryName}</span>
        <button class="delete-category" onclick="deleteCategory('${categoryName}')">Delete</button>
    `;
    taskBar.appendChild(newButton);

    // Check if this is the active category and highlight it
    if (categoryName === currentCategory) {
        highlightActiveCategory(newButton);
    }
}

function highlightActiveCategory(button) {
    const buttons = document.querySelectorAll('.category');
    buttons.forEach(btn => {
        btn.classList.remove('active-category'); // Remove the class from all buttons
    });
    button.classList.add('active-category'); // Add the class to the active button
}

// Call loadCategories on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadCategories(); // Load categories when DOM content is loaded
});
