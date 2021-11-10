var taskInput = document.getElementById("newTask");
var addBtn = document.getElementsByClassName("add")[0];
var tasksHolder = document.getElementById("tasks");
var completedTasksHolder = document.getElementById("completed-tasks");
const options = document.querySelectorAll(".status");
const tasksStatus = document.querySelector(".task-status");
const myDropdown = document.getElementById("myDropdown");
const dropdownContent = document.getElementsByClassName("dropdown-content");
const newCategory = document.querySelector("#status");
const close = document.querySelector("#closeIcon");
const categoryList = document.querySelector(".dropdown-links");

// Show all active coloring
tasksStatus.addEventListener("click", (event) => {
  if (event.target == tasksStatus) return;
  for (let option of options) {
    option.classList.remove("onIt");
  }
  event.target.classList.add("onIt");
});

//Category Dropdown Toggle.
function categoryDropDownToggle() {
  myDropdown.classList.toggle("show");
}
//Close category when clicking anywhere on the website.
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var i;
    for (i = 0; i < dropdownContent.length; i++) {
      var openDropdown = dropdownContent[i];
      openDropdown.classList.remove("show");
    }
  }
};

//Stops category js from applying to input
newCategory.addEventListener("click", (event) => {
  event.stopPropagation();
});

//Builds a new task element
var createNewTaskElement = function (taskString) {
  var listItem = document.createElement("li");
  var checkBox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");

  label.innerText = taskString;

  checkBox.type = "checkbox";
  editInput.type = "text";

  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
};

//Creates the new task.
var addTask = function () {
  var listItem = createNewTaskElement(taskInput.value);
  tasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, completedTasks);
  taskInput.value = "";
};

//Changes the task position between active and completed.

var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

for (var i = 0; i < tasksHolder.children.length; i++) {
  bindTaskEvents(tasksHolder.children[i], completedTasks);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], activeTasks);
}

//Adds a new task.
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    addBtn.click();
  }
});

var editTask = function () {
  var listItem = this.parentNode;

  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("label");
  var containsClass = listItem.classList.contains("editMode");

  if (containsClass) {
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }
  listItem.classList.toggle("editMode");
};

var deleteTask = function () {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
};

var completedTasks = function () {
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, activeTasks);
};

var activeTasks = function () {
  var listItem = this.parentNode;
  tasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, completedTasks);
};

newCategory.addEventListener("focusin", () => {
  newCategory.value = "";
  newCategory.style.background = "white";
  newCategory.placeholder = "Create a new category...";
});

function onCategoryClick(event) {
  if (event.target.classList.contains("close-icon")) {
    categoryList.innerHTML = "";
    let urlArray = window.location.href.replace("#", "").split("/");
    fetch(`/user/${urlArray[urlArray.length - 1]}/category`, {
      method: "POST",
      body: JSON.stringify({ removeCategory: true, category: event.target.parentNode.innerText }),
      headers: { "content-type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          json.data.forEach((categoryName) => {
            let newDocument = document.createElement("a");
            newDocument.addEventListener("click", onCategoryClick);
            newDocument.innerHTML = `<i class="fa fa-times close-icon"></i>${categoryName}`;
            categoryList.append(newDocument);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        newCategory.value = "An error has occured";
        //Change value color to error color
        newCategory.style.background = "PaleGoldenrod";
        setTimeout(() => {
          if (newCategory.value == "An error has occured") {
            newCategory.value = "";

            //Change value color back to default
            newCategory.style.background = "white";
            newCategory.placeholder = "Create a new category";
          }
        }, 1500);
      });
  } else {
  }
}

newCategory.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    newCategory.blur();
    categoryList.innerHTML = "";
    let urlArray = window.location.href.replace("#", "").split("/");
    fetch(`/user/${urlArray[urlArray.length - 1]}/category`, {
      method: "POST",
      body: JSON.stringify({ removeCategory: false, category: newCategory.value }),
      headers: { "content-type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          newCategory.value = "";
          newCategory.placeholder = "Not your To-Do List";
          newCategory.style.background = "PaleGoldenrod";
          setTimeout(() => {
            if (newCategory.placeholder == "Not your To-Do List") {
              //Change value color back to default
              newCategory.style.background = "white";
              newCategory.placeholder = "Create a new category...";
            }
          }, 1500);
        }
        if (json.data) {
          json.data.forEach((categoryName) => {
            let newDocument = document.createElement("a");
            newDocument.addEventListener("click", onCategoryClick);
            newDocument.innerHTML = `<i class="fa fa-times close-icon"></i> ${categoryName}`;
            categoryList.append(newDocument);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        newCategory.value = "An error has occured";
        //Change value color to error color
        newCategory.style.background = "PaleGoldenrod";
        setTimeout(() => {
          if (newCategory.value == "An error has occured") {
            newCategory.value = "";

            //Change value color back to default
            newCategory.style.background = "white";
            newCategory.placeholder = "Create a new category";
          }
        }, 1500);
      });
  }
});
