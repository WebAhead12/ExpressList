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
let CURRENT_OPTION = document.querySelector(".onIt").innerText;

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
  CURRENT_OPTION = event.target.innerText;
  updateTaskList();
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
    //Updates the list back to default if the category being viewed got deleted.
    if (CURRENT_CATEGORY == event.target.parentNode.innerText) {
      CURRENT_CATEGORY = "";
      updateTaskList();
    }
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
            newDocument.classList.add("categoryButton");
            newDocument.addEventListener("click", onCategoryClick);
            newDocument.innerHTML = `<i class="fa fa-times close-icon"></i>${categoryName}`;
            if (CURRENT_CATEGORY == categoryName) newDocument.classList.add("categoryOnIt");
            categoryList.append(newDocument);
          });
        }
      })
      .catch((error) => {
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
    let buttonsArray = Array.from(document.querySelectorAll(".dropdown-links a"));
    buttonsArray.forEach((val) => {
      val.classList.remove("categoryOnIt");
    });
    if (CURRENT_CATEGORY == event.target.innerText) {
      CURRENT_CATEGORY = "";
      event.target.classList.remove("categoryOnIt");
    } else {
      CURRENT_CATEGORY = event.target.innerText;
      event.target.classList.add("categoryOnIt");
    }
    updateTaskList();
  }
}
//Create new category to be added to user category list.
newCategory.addEventListener("keyup", (event) => {
  if (event.key == "Enter" && event.target.value.trim() != "") {
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
            newDocument.classList.add("categoryButton");
            newDocument.innerHTML = `<i class="fa fa-times close-icon"></i>${categoryName}`;
            if (CURRENT_CATEGORY == categoryName) newDocument.classList.add("categoryOnIt");
            categoryList.append(newDocument);
          });
        }
      })
      .catch((error) => {
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

  editButton.onclick = function () {
    listItem = this.parentNode;

    editInput = listItem.querySelector("input[type=text]");
    let label = listItem.querySelector("label");
    let containsClass = listItem.classList.contains("editMode");

    if (containsClass) {
      label.innerText = editInput.value;
    } else {
      editInput.value = label.innerText;
    }
    listItem.classList.toggle("editMode");
  };
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

function updateTaskList() {
  tasksHolder.innerHTML = "";
  completedTasksHolder.innerHTML = "";
  let urlArray = window.location.href.replace("#", "").split("/");
  fetch(`/user/${urlArray[urlArray.length - 1]}/data/${CURRENT_OPTION}/${CURRENT_CATEGORY}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((json) => {
      if (json.length) {
        json.forEach((elem) => {
          let tempElement = createNewTaskElement(elem.taskText);
          bindTaskEvents(tempElement);
          if (elem.completed) {
            completedTasksHolder.appendChild(tempElement);
            tempElement.querySelector("input[type=checkbox]").checked = true;
          } else {
            tasksHolder.appendChild(tempElement);
          }
        });
      }
    });
}

updateTaskList();
document.getElementById("headerTitle").innerText = `${window.location.href.split("/")[4]}'s To-Do List`;
