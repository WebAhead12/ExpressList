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
const logout = document.querySelector(".log-out");

let CURRENT_CATEGORY = "";

//Logout button
logout.addEventListener("click", (event) => {
  fetch("/logout")
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((json) => {
      if (json.worked) window.location.href = "/";
    });
});

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
//Reset category input when clicking on it.
newCategory.addEventListener("focusin", () => {
  newCategory.value = "";
  newCategory.style.background = "white";
  newCategory.placeholder = "Create a new category...";
});
//Deletes category if x is clicked, otherwise updates the task list to show category only.
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
    //THIS NEEDS TO BE CODED TO REFRESH THE TASKS WITH CATEGORY
  }
}
//Create new category to be added to user category list.
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
//Changes the task position between active and completed.
var bindTaskEvents = function (taskListItem) {
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");

  editButton.onclick = function () {};
  deleteButton.onclick = function () {};
  checkBox.onchange = function () {};
};

//Adds a new task.
addBtn.addEventListener("click", {});

taskInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    addBtn.click();
  }
});

function updateTaskList(arr) {
  tasksHolder.innerHTML = "";
  completedTasksHolder.innerHTML = "";
  // [{taskName: "", completed: true}]
  arr.forEach((elem) => {
    let tempElement = createNewTaskElement(elem.taskText);
    bindTaskEvents(tempElement);
    if (elem.completed) {
      tasksHolder.appendChild(tempElement);
    } else {
      completedTasksHolder.appendChild(tempElement);
    }
  });
}
