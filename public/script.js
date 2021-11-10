var taskInput = document.getElementById("newTask");
var addBtn = document.getElementsByClassName("add")[0];
var tasksHolder = document.getElementById("tasks");
var completedTasksHolder = document.getElementById("completed-tasks");
const options = document.querySelectorAll('.status')
const tasksStatus = document.querySelector('.task-status')
const myDropdown = document.getElementById("myDropdown")
const dropdownContent = document.getElementsByClassName("dropdown-content")


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
  return listItem;
}

var addTask = function () {
  console.log("Add Task...");
  var listItem = createNewTaskElement(taskInput.value);
  tasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, completedTasks);
  taskInput.value = "";
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

  if (event.keyCode == 13) {
    event.preventDefault();
    addBtn.click();
  }
});

// taskInput.addEventListener('keyup', (event) => {
//   if (event.keycode == 13) {
//     const labelClassArr = Array.from(document.querySelector('.edit').classList)
//     //selecting an object that would be given the class 'show' if clicked on modify
//     if (labelClassArr.indexOf('show') == -1) {
//       button.click()
//     } else {
//       modifyButton.click()
//     }
//   }
// })



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