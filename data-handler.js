const path = require("path");
const fs = require("fs");

let dataList = require("./data/todolist.json");
let accountList = require("./data/accounts.json");

// Updates the accounts data file.
function saveData() {
  fs.writeFileSync("./data/todolist.json", JSON.stringify(dataList, undefined, 2));
}

// Get the user todolist data.
function searchUserByName(user) {
  return accountList.find((element) => element["user"].toLowerCase() === user.toLowerCase());
}

function getUserData(user) {
  return dataList.find((element) => element["user"].toLowerCase() === user.toLowerCase());
}

// Setup a default data for a user.
function setupToDoList(user) {
  if (getUserData(user)) return false;
  let obj = {
    user: user,
    categories: [],
    list: [],
  };
  dataList.push(obj);
  saveData();
  return true;
}
//Get the user categories list.
function getCategories(user) {
  setupToDoList(user);
  let userData = getUserData(user);
  return userData.categories;
}

// Adds a new category to a user's data.
function addCategory(user, category) {
  setupToDoList(user);
  let userData = getUserData(user);
  if (userData["categories"].find((categoryName) => categoryName.toLowerCase() === category.toLowerCase()))
    return false;
  userData["categories"].push(category);
  saveData();
  return true;
}

// Removes a category from user's data.
function removeCategory(user, category) {
  let userData = getUserData(user);
  if (!userData) return false;
  userData.categories = userData.categories.filter((value) => value.toLowerCase() != category.toLowerCase());
  userData.list = userData.list.filter((task) => task.category.toLowerCase() != category.toLowerCase());
  saveData();
  return true;
}

// Adds a new todo list task to user's data.
function addTask(user, taskText, category = "") {
  setupToDoList(user);
  let userData = getUserData(user);
  if (userData.list.find((element) => element["taskText"].toLowerCase() === taskText.toLowerCase())) return false;
  let taskObj = {
    taskText: taskText,
    completed: false,
    category: category,
  };
  userData.list.push(taskObj);
  saveData();
  return true;
}

// Modifies an existing todo list task data.
function modifyTask(user, oldTaskText, newTaskText) {
  let userData = getUserData(user);
  if (!userData) return false;
  let task = userData.list.find((task) => task.taskText === oldTaskText);
  if (!task) return false;
  task.taskText = newTaskText;
  saveData();
  return true;
}

// Deletes an existing todo list task.
function deleteTask(user, taskText) {
  let userData = getUserData(user);
  if (!userData) return false;
  userData.list = userData.list.filter((task) => task.taskText !== taskText);
  saveData();
  return true;
}

// Deletes all todo list tasks.
function deleteAllTasks(user) {
  let userData = getUserData(user);
  if (!userData) return false;
  userData.list = [];
  saveData();
  return true;
}

// Toggles a task completion between true and false.
function toggleTaskCompletion(user, taskText) {
  let userData = getUserData(user);
  if (!userData) return false;
  let task = userData.list.find((task) => task.taskText === taskText);
  task.completed = !task.completed;
  saveData();
  return true;
}

module.exports = {
  getUserData,
  searchUserByName,
  getCategories,
  addCategory,
  removeCategory,
  addTask,
  modifyTask,
  deleteTask,
  deleteAllTasks,
  toggleTaskCompletion,
};
