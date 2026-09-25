/* =========================================
   TASK MANAGER JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const progressTasks = document.getElementById("progressTasks");
const completedTasks = document.getElementById("completedTasks");
const overdueTasks = document.getElementById("overdueTasks");

const productivityPercentage =
    document.getElementById("productivityPercentage");

const progressFill =
    document.getElementById("progressFill");

const taskModal =
    document.getElementById("taskModal");

const openTaskModal =
    document.getElementById("openTaskModal");

const emptyAddTask =
    document.getElementById("emptyAddTask");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const cancelTask =
    document.getElementById("cancelTask");

const taskForm =
    document.getElementById("taskForm");

const quickTaskForm =
    document.getElementById("quickTaskForm");

const quickTaskInput =
    document.getElementById("quickTaskInput");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const themeToggle =
    document.getElementById("themeToggle");

const mobileMenuBtn =
    document.querySelector(".mobile-menu-btn");

const sidebar =
    document.querySelector(".sidebar");


/* =========================================
   TASK DATA
========================================= */

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let editingTaskId = null;


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   CREATE TASK ID
========================================= */

function createTaskId() {

    return Date.now();

}


/* =========================================
   OPEN MODAL
========================================= */

function openModal() {

    taskModal.classList.add("active");

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    taskModal.classList.remove("active");

    taskForm.reset();

    editingTaskId = null;

}


/* =========================================
   OPEN MODAL BUTTONS
========================================= */

openTaskModal.addEventListener(
    "click",
    openModal
);

emptyAddTask.addEventListener(
    "click",
    openModal
);

closeTaskModal.addEventListener(
    "click",
    closeModal
);

cancelTask.addEventListener(
    "click",
    closeModal
);


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

taskModal.addEventListener(
    "click",
    function (event) {

        if (event.target === taskModal) {

            closeModal();

        }

    }
);


/* =========================================
   CREATE TASK
========================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const title =
            document.getElementById("taskTitle").value.trim();

        const description =
            document.getElementById("taskDescription").value.trim();

        const priority =
            document.getElementById("taskPriority").value;

        const status =
            document.getElementById("taskStatus").value;

        const dueDate =
            document.getElementById("taskDueDate").value;

        const category =
            document.getElementById("taskCategory").value;


        /* EDIT EXISTING TASK */

        if (editingTaskId !== null) {

            tasks = tasks.map(function (task) {

                if (task.id === editingTaskId) {

                    return {
                        ...task,
                        title,
                        description,
                        priority,
                        status,
                        dueDate,
                        category
                    };

                }

                return task;

            });

        }


        /* CREATE NEW TASK */

        else {

            const newTask = {

                id: createTaskId(),

                title,

                description,

                priority,

                status,

                dueDate,

                category,

                createdAt: new Date().toISOString()

            };

            tasks.unshift(newTask);

        }


        saveTasks();

        renderTasks();

        updateStatistics();

        closeModal();

    }
);


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const selectedStatus =
        statusFilter.value;

    const selectedPriority =
        priorityFilter.value;


    /* FILTER TASKS */

    const filteredTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm);


        const matchesStatus =
            selectedStatus === "all" ||
            task.status === selectedStatus;


        const matchesPriority =
            selectedPriority === "all" ||
            task.priority === selectedPriority;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );

    });


    /* CLEAR LIST */

    taskList.innerHTML = "";


    /* EMPTY STATE */

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    /* CREATE TASK CARDS */

    filteredTasks.forEach(function (task) {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);

    });

}


/* =========================================
   CREATE TASK ELEMENT
========================================= */

function createTaskElement(task) {

    const taskItem =
        document.createElement("div");

    taskItem.className = "task-item";


    /* CHECK IF COMPLETED */

    const isCompleted =
        task.status === "completed";


    /* PRIORITY CLASS */

    const priorityClass =
        priority-${task.priority};


    /* FORMAT DATE */

    const formattedDate =
        formatDate(task.dueDate);


    taskItem.innerHTML = `

        <div
            class="task-checkbox ${
                isCompleted ? "completed" : ""
            }"
            data-id="${task.id}"
        >

            ${
                isCompleted
                    ? '<i class="fa-solid fa-check"></i>'
                    : ""
            }

        </div>


        <div class="task-info">

            <div class="task-title">

                ${escapeHTML(task.title)}

            </div>


            ${
                task.description
                    ? `
                    <div class="task-description">

                        ${escapeHTML(task.description)}

                    </div>
                    `
                    : ""
            }


            <div class="task-meta">

                <span class="task-tag ${priorityClass}">

                    ${capitalize(task.priority)}

                </span>


                ${
                    formattedDate
                        ? `
                        <span class="task-date">

                            <i class="fa-regular fa-calendar"></i>

                            ${formattedDate}

                        </span>
                        `
                        : ""
                }


                <span class="task-tag">

                    ${capitalize(task.category)}

                </span>

            </div>

        </div>


        <span class="task-status">

            ${getStatusText(task.status)}

        </span>


        <div class="task-actions">

            <button
                class="task-action-btn edit-task"
                data-id="${task.id}"
                title="Edit task"
            >

                <i class="fa-solid fa-pen"></i>

            </button>


            <button
                class="task-action-btn delete-task"
                data-id="${task.id}"
                title="Delete task"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;


    return taskItem;

}


/* =========================================
   TASK LIST CLICK EVENTS
========================================= */

taskList.addEventListener(
    "click",
    function (event) {

        const checkbox =
            event.target.closest(".task-checkbox");

        const editButton =
            event.target.closest(".edit-task");

        const deleteButton =
            event.target.closest(".delete-task");


        /* COMPLETE TASK */

        if (checkbox) {

            const id =
                Number(checkbox.dataset.id);

            toggleTask(id);

        }


        /* EDIT TASK */

        if (editButton) {

            const id =
                Number(editButton.dataset.id);

            editTask(id);

        }


        /* DELETE TASK */

        if (deleteButton) {

            const id =
                Number(deleteButton.dataset.id);

            deleteTask(id);

        }

    }
);


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            return {
                ...task,

                status:
                    task.status === "completed"
                        ? "todo"
                        : "completed"

            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(function (task) {

            return task.id === id;

        });


    if (!task) return;


    editingTaskId = id;


    document.getElementById("taskTitle").value =
        task.title;

    document.getElementById("taskDescription").value =
        task.description;

    document.getElementById("taskPriority").value =
        task.priority;

    document.getElementById("taskStatus").value =
        task.status;

    document.getElementById("taskDueDate").value =
        task.dueDate;

    document.getElementById("taskCategory").value =
        task.category;


    openModal();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");


    if (!confirmed) return;


    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* =========================================
   QUICK ADD TASK
========================================= */

quickTaskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            quickTaskInput.value.trim();


        if (!title) return;


        const newTask = {

            id: createTaskId(),

            title,

            description: "",

            priority: "medium",

            status: "todo",

            dueDate: "",

            category: "personal",

            createdAt: new Date().toISOString()

        };


        tasks.unshift(newTask);


        saveTasks();

        renderTasks();

        updateStatistics();


        quickTaskInput.value = "";

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =========================================
   FILTERS
========================================= */

statusFilter.addEventListener(
    "change",
    renderTasks
);

priorityFilter.addEventListener(
    "change",
    renderTasks
);


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const progress =
        tasks.filter(function (task) {

            return task.status === "progress";

        }).length;


    const completed =
        tasks.filter(function (task) {

            return task.status === "completed";

        }).length;


    const overdue =
        tasks.filter(function (task) {

            return isOverdue(task);

        }).length;


    totalTasks.textContent =
        total;

    progressTasks.textContent =
        progress;

    completedTasks.textContent =
        completed;

    overdueTasks.textContent =
        overdue;


    /* PRODUCTIVITY */

    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    productivityPercentage.textContent =
        ${percentage}%;


    progressFill.style.width =
        ${percentage}%;

}


/* =========================================
   CHECK OVERDUE
========================================= */

function isOverdue(task) {

    if (
        !task.dueDate ||
        task.status === "completed"
    ) {

        return false;

    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const dueDate =
        new Date(task.dueDate);

    dueDate.setHours(
        0,
        0,
        0,
        0
    );


    return dueDate < today;

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date) {

    if (!date) return "";


    const dateObject =
        new Date(date);


    if (isNaN(dateObject)) {
        return "";
    }


    return dateObject.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================
   STATUS TEXT
========================================= */

function getStatusText(status) {

    const statusNames = {

        todo: "To Do",

        progress: "In Progress",

        completed: "Completed"

    };


    return statusNames[status] || status;

}


/* =========================================
   CAPITALIZE
========================================= */

function capitalize(text) {

    if (!text) return "";

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================
   PROTECT HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   DARK MODE
========================================= */

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark-mode");


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "taskflowTheme",
            isDark ? "dark" : "light"
        );


        themeToggle.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

    }
);


/* =========================================
   LOAD SAVED THEME
========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "taskflowTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}


/* =========================================
   MOBILE SIDEBAR
========================================= */

mobileMenuBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.toggle("open");

    }
);


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /* CTRL + K / CMD + K */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }


        /* ESCAPE CLOSES MODAL */

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


/* =========================================
   INITIALIZE APPLICATION
========================================= */

loadTheme();

renderTasks();

updateStatistics();