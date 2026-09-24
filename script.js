// ==============================
// TASK MANAGER
// ==============================

// Get elements from HTML
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");


// ==============================
// LOAD SAVED TASKS
// ==============================

let tasks = JSON.parse(localStorage.getItem("brightEdgeTasks")) || [];


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {
    localStorage.setItem("brightEdgeTasks", JSON.stringify(tasks));
}


// ==============================
// DISPLAY TASKS
// ==============================

function displayTasks() {

    // Clear the current task list
    taskList.innerHTML = "";

    // If there are no tasks
    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                <h3>No tasks yet</h3>
                <p>Add a task above to get started.</p>
            </div>
        `;

        taskCount.textContent = "0 Tasks";

        return;
    }


    // Create a card for every task
    tasks.forEach(function(task) {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        // Add completed class if task is completed
        if (task.completed) {
            taskCard.classList.add("completed");
        }


        taskCard.innerHTML = `
            <div class="task-content">

                <h3>${task.title}</h3>

                ${
                    task.description
                    ? <p>${task.description}</p>
                    : ""
                }

            </div>

            <div class="task-actions">

                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;


        // ==============================
        // COMPLETE / UNDO
        // ==============================

        const completeButton =
            taskCard.querySelector(".complete-btn");

        completeButton.addEventListener("click", function() {

            task.completed = !task.completed;

            saveTasks();

            displayTasks();

        });


        // ==============================
        // DELETE
        // ==============================

        const deleteButton =
            taskCard.querySelector(".delete-btn");

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {

                return item.id !== task.id;

            });

            saveTasks();

            displayTasks();

        });


        // Add task card to page
        taskList.appendChild(taskCard);

    });


    // Update counter
    updateTaskCount();
}


// ==============================
// ADD TASK
// ==============================

taskForm.addEventListener("submit", function(event) {

    // Stop the form from refreshing the page
    event.preventDefault();


    // Get values from the form
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();


    // Make sure title is not empty
    if (title === "") {
        return;
    }


    // Create new task
    const newTask = {

        id: Date.now(),

        title: title,

        description: description,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save task
    saveTasks();


    // Clear the form
    taskForm.reset();


    // Display the new task
    displayTasks();

});


// ==============================
// TASK COUNTER
// ==============================

function updateTaskCount() {

    if (tasks.length === 1) {

        taskCount.textContent = "1 Task";

    } else {

        taskCount.textContent = '${tasks.length} Tasks';

    }

}


// ==============================
// LOAD TASKS WHEN PAGE OPENS
// ==============================

displayTasks();