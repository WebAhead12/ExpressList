var taskInput = document.getElementById("newTask");
var addBtn = document.getElementsByClassName("add")[0];
var tasksHolder = document.getElementById("tasks");
var completedTasksHolder = document.getElementById("completed-tasks");
const options = document.querySelectorAll('.status')
const tasksStatus = document.querySelector('.task-status')
const myDropdown = document.getElementById("myDropdown")
const dropdownContent = document.getElementsByClassName("dropdown-content")
const newCategory = document.querySelector("#status")
const close = document.querySelector("#closeIcon");
const categoryList = document.querySelector(".dropdown-links")




newCategory.addEventListener("click", (event) => {
  event.stopPropagation();
})



function myFunction() {
  myDropdown.classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var i
    for (i = 0; i < dropdownContent.length; i++) {
      var openDropdown = dropdownContent[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
}

tasksStatus.addEventListener('click', (event) => {
  console.log(event.target);
  if (event.target == tasksStatus) return;
  for (let option of options) {
    option.classList.remove('onIt')
  }
  event.target.classList.add('onIt')
})
var createNewTaskElement = function (taskString) {
  var listItem = document.createElement("li");
  var checkBox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");
  var categoryItem = document.createElement("a");


  label.innerText = taskString;


  checkBox.type = "checkbox";
  editInput.type = "text";

  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete"

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  listItem.appendChild(categoryItem)
  return listItem;
}

var addTask = function () {
  console.log("Add Task...");
  var listItem = createNewTaskElement(taskInput.value);
  tasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, completedTasks);
  taskInput.value = "";
}

var addCategory = function () {
  console.log("Add Category...");
  var listItem = createNewCategory(newCategory.value);



}

var editTask = function () {
  console.log("Edit Task...");
  console.log("Change 'edit' to 'save'");

  var listItem = this.parentNode;

  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("label");
  var containsClass = listItem.classList.contains("editMode");


  if (containsClass) {
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }
  listItem.classList.toggle("editMode")

}


var deleteTask = function () {
  console.log("Delete Task...");

  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
}

var completedTasks = function () {
  console.log("completed Task");
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, activeTasks);
}

var activeTasks = function () {
  console.log("tasks");
  var listItem = this.parentNode;
  tasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, completedTasks);
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keyup", (event) => {

  if (event.key == "Enter") {
    event.preventDefault();
    addBtn.click();
  }
});

newCategory.addEventListener("focusin", () => {
  newCategory.value = ""
  newCategory.style.background = 'white'
  newCategory.placeholder = "Create a new category..."
})

function onCategoryClick() {

}

newCategory.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    newCategory.blur();
    categoryList.innerHTML = ""
    let urlArray = window.location.href.split("/")
    fetch(`/${urlArray[urlArray.length - 1]}/category`, {
      method: "POST",
      body: JSON.stringify({ "category": newCategory.value }),
      headers: { "content-type": "application/json" },
    })

      .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then(array => {
        array.forEach(categoryName => {
          let newDocument = document.createElement("a")
          newDocument.addEventListener("click", onCategoryClick)
          newDocument.innerHTML = `<i class="fa fa-times close-icon"></i> ${categoryName}`
          categoryList.append(newDocument)
        });
      })
      .catch(error => {
        newCategory.value = "An error has occured"
        //Change value color to error color
        newCategory.style.background = 'PaleGoldenrod'
        newCategory.placeholder = "Not your To-Do List"
        setTimeout(() => {
          if (newCategory.value == "An error has occured") {
            newCategory.value = "";

            //Change value color back to default
            newCategory.style.background = 'white'
            newCategory.placeholder = "Create a new category"
          }
        }, 1500)
      })
  }
})


var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  console.log("bind list item events");
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