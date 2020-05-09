let inputSelectors;
let taskList = [];

document.addEventListener('DOMContentLoaded', () => {
    loadInputSelectors();
    addClickListenerToAddButton();
    addClickListenerToCloseButton();
    addClickListenerToSaveButton();
    addClickListenerToCancelButton();
});

const loadInputSelectors = () => {
    inputSelectors = {
        taskTitle: document.getElementById("task-title"),
        taskDescription: document.getElementById("task-description"),
        taskPriority: document.getElementById("task-priority"),
        taskDeadline: document.getElementById("task-deadline"),
        taskIndex: document.getElementById("task-index")
    }
}

const addClickListenerToAddButton = () => {
    document.getElementById("add-task").addEventListener("click", () => {
        document.getElementsByClassName("modal")[0].classList.add("is-active");
    });
}

const addClickListenerToCloseButton = () => {
    document.getElementsByClassName("delete")[0].addEventListener("click", () => {
        cleanInputs();
        if (document.querySelectorAll('.notification .delete')[0])
            document.querySelectorAll('.notification .delete')[0].click();
        document.getElementsByClassName("modal")[0].classList.remove("is-active");
    });
}

const addClickListenerToSaveButton = () => {
    document.getElementById("save-task").addEventListener("click", () => {
        let validInputs = formValidation();

        if (validInputs) {
            let taskIndex = inputSelectors.taskIndex.value;

            if (taskIndex) {
                editTask(taskIndex);
                editTaskCard(taskIndex);
            } else {
                let newTaskIndex = addNewTask();
                addTaskCard(newTaskIndex);
                addClickListenerToEditButton(newTaskIndex);
                addClickListenerToDeleteButton(newTaskIndex);
            }

            document.getElementsByClassName("delete")[0].click();
            cleanInputs();
        } else {
            showNotification();
        }
    });
}

const formValidation = () => {
    if (
        !inputSelectors.taskTitle.value || 
        !inputSelectors.taskDescription.value || 
        !inputSelectors.taskPriority.value
        ) {
            return false;
    }
    return true;
}

const showNotification = () => {
    if (document.querySelectorAll('.notification .delete')[0])
        document.querySelectorAll('.notification .delete')[0].click();

    let notification = document.createElement('div');
    notification.classList = "notification is-danger";

    notification.innerHTML = `
        <button class="delete"></button>
        Please fill-in all <strong>required</strong> fields.
    `;

    document.getElementsByClassName("modal-card-body")[0].prepend(notification);
    addClickListenerToCloseNotification();
}

const addClickListenerToCloseNotification = () => {
    let close = document.querySelectorAll('.notification .delete');

    for (let i = 0; i < close.length; i++) {
        close[i].addEventListener("click", () => {
            let notification = close[i].parentNode;
            notification.parentNode.removeChild(notification);
        });
    }
}

const addNewTask = () => {
    return taskList.push({
        title: inputSelectors.taskTitle.value,
        description: inputSelectors.taskDescription.value,
        priority: inputSelectors.taskPriority.options[inputSelectors.taskPriority.options.selectedIndex].text,
        priorityValue: inputSelectors.taskPriority.value,
        deadline: inputSelectors.taskDeadline.value
    }) - 1;
}

const addTaskCard = (taskIndex) => {
    let taskDiv = document.createElement('div');

    taskDiv.innerHTML = `
        <div class="card-content">
            <p class="title">${taskList[taskIndex].title.substr(0, 20)}</p>
            <p class="content">${taskList[taskIndex].description.substr(0, 170)}</p>
            <p class="content is-small">${taskList[taskIndex].deadline}</p>
            <input type="hidden" class="task-index" value="${taskIndex}">
        </div>
        <footer class="card-footer">
            <p class="card-footer-item">
                <span class="${getPriorityColor(taskList[taskIndex].priority)} content is-large">
                    ${taskList[taskIndex].priority}
                </span>
            </p>
            <p class="card-footer-item">
                <span class="icon has-text-primary edit-task">
                    <i class="fas fa-edit fa-2x"></i>
                </span>
            </p>
            <p class="card-footer-item">
                <span class="icon has-text-primary delete-task">
                    <i class="far fa-trash-alt fa-2x"></i>
                </span>
            </p>
        </footer>
    `;

    taskDiv.id = `task-${taskIndex}`;
    taskDiv.classList = "card column is-one-third";
    document.getElementById("task-list").appendChild(taskDiv);
}

const editTask = (taskIndex) => {
    let taskData = {
        title: inputSelectors.taskTitle.value,
        description: inputSelectors.taskDescription.value,
        priority: inputSelectors.taskPriority.options[inputSelectors.taskPriority.options.selectedIndex].text,
        priorityValue: inputSelectors.taskPriority.value,
        deadline: inputSelectors.taskDeadline.value
    };

    taskList[taskIndex] ? taskList[taskIndex] = taskData : '';
}

const editTaskCard = (taskIndex) => {
    let taskDiv = document.getElementById(`task-${taskIndex}`);

    taskDiv.children[0].children[0].innerHTML = taskList[taskIndex].title.substr(0, 20);
    taskDiv.children[0].children[1].innerHTML = taskList[taskIndex].description.substr(0, 170);
    taskDiv.children[0].children[2].innerHTML = taskList[taskIndex].deadline
    taskDiv.children[1].children[0].innerHTML = `
        <p class="card-footer-item">
            <span class="${getPriorityColor(taskList[taskIndex].priority)} content is-large">
                ${taskList[taskIndex].priority}
            </span>
        </p>
    `;
}

const getPriorityColor = (priority) => {
    let priorityClass = '';

    switch (priority) {
        case "Low":
            priorityClass = "has-text-success";
            break;

        case "Medium":
            priorityClass = "has-text-warning";
            break;

        case "High":
            priorityClass = "has-text-danger";
            break;
    
        default:
            priorityClass = "has-text-info"
            break;
    }

    return priorityClass;
}

const cleanInputs = () => {
    inputSelectors.taskTitle.value = "";
    inputSelectors.taskDescription.value = "";
    inputSelectors.taskPriority.value = "";
    inputSelectors.taskDeadline.value = "";
    inputSelectors.taskIndex.value = "";
}

const addClickListenerToCancelButton = () => {
    document.getElementById("cancel").addEventListener("click", () => {
        cleanInputs();
        document.getElementsByClassName("delete")[0].click();
    });
}

const addClickListenerToEditButton = (taskIndex) => {
    let edit = document.querySelector(`#task-${taskIndex} .edit-task`);

    edit.addEventListener("click", function() {
        document.getElementsByClassName("modal")[0].classList.add("is-active");
        let selectedCardIndex = this.closest('div').children[0].children[3].value;
        inputSelectors.taskIndex.value = selectedCardIndex;
        loadInputsForEdition();
    });
}

const loadInputsForEdition = () => {
    let selectedTask = taskList[inputSelectors.taskIndex.value];

    if (selectedTask) {
        inputSelectors.taskTitle.value = selectedTask.title;
        inputSelectors.taskDescription.value = selectedTask.description;
        inputSelectors.taskPriority.value = selectedTask.priorityValue;
        inputSelectors.taskDeadline.value = selectedTask.deadline;
    }
}

const addClickListenerToDeleteButton = (taskIndex) => {
    let remove = document.querySelector(`#task-${taskIndex} .delete-task`);

    remove.addEventListener("click", function() {
        let selectedCardIndex = `task-${this.closest('div').children[0].children[3].value}`;
        let selectedCard = document.getElementById(selectedCardIndex);
        selectedCard.parentNode.removeChild(selectedCard);
    });
}
