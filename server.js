const express = require("express");
const PORT = process.env.PORT || 3000;
const path = require("path");
const cookiePraser = require("cookie-parser");
const authHandler = require(path.join(__dirname, "authentication-handler"));
const dataHandler = require(path.join(__dirname, "data-handler"));

const server = express();

server.use(express.json());
server.use(cookiePraser());

//Handles the user login cookies.
server.use((req, res, next) => {
  const token = req.cookies.account;
  if (token) {
    const user = authHandler.checkRegisteredUser(token);
    if (user) req.user = user;
  }
  next();
});

//Checks if the user is logged in (through cookies) and redirects them to their page, else to login
server.get("/", (req, res) => {
  if (req.user) {
    res.redirect(`/user/${req.user}`);
    return;
  }
  res.sendFile(path.join(__dirname, "public", "log-in.html"));
});

//Logins the user.
server.post("/", (req, res) => {
  const account = req.body;
  const token = authHandler.tokenifyAccount(account);
  if (!authHandler.checkRegisteredUser(token)) {
    res.send({ error: "Password incorrect." });
    return;
  }
  res.cookie("account", token, { maxAge: 600000 });
  res.send({ user: account.user });
});

//Sends the user his todolist page.
server.get("/user/:user", (req, res) => {
  let account = dataHandler.searchUserByName(req.params.user);
  if (!account) {
    res.redirect("/");
    return;
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Reroutes the search fetch into the correct link
server.get("/user/search/:user", (req, res) => {
  let account = dataHandler.getUserData(req.params.user);
  if (!account) {
    res.send({ error: "User not found!" });
    return;
  }
  res.send({ user: account.user });
});

//Returns the tasks according to type (All, Complete, Incomplete)
server.get("/user/:user/data/:type", (req, res) => {
  let type = req.params.type;
  let user = req.params.user;
  userData = dataHandler.getUserData(user);
  if (!userData) {
    res.send([]);
    return;
  }
  switch (type.toLowerCase()) {
    case "completed":
      let completed = userData.list.filter((tasks) => tasks.completed);
      res.send(completed);
      return;
    case "incomplete":
      let incomplete = userData.list.filter((tasks) => !tasks.completed);
      res.send(incomplete);
      return;
    default:
      res.send(userData.list);
      return;
  }
});

//Sends the user his todolist data according to type and category.
server.get("/user/:user/data/:type/:category", (req, res) => {
  let type = req.params.type;
  let user = req.params.user;
  let category = req.params.category.toLowerCase();
  userData = dataHandler.getUserData(user);
  if (userData.categories.includes(category)) {
    let choosenCategory = userData.list.filter((tasks) => tasks.category.toLowerCase() == category);
    switch (type.toLowerCase()) {
      case "completed":
        let completed = choosenCategory.filter((tasks) => tasks.completed);
        res.send(completed);
        return;
      case "incomplete":
        let incomplete = choosenCategory.filter((tasks) => !tasks.completed);
        res.send(incomplete);
        return;
      default:
        res.send(choosenCategory);
        return;
    }
  }
  res.redirect(`/user/${user}/data/${type}`);
});

//Receives the user new todolist data.
server.post("/user/:user/", (req, res) => {
  let user = req.params.user;
  let method = req.body.method;
  let taskText = req.body.taskText;
  let newTask = req.body.newTaskText;
  let category = req.body.category;
  if (!req.user || user != req.user) {
    return res.send({ message: "Not your to-do list." });
  }

  if (!dataHandler.getUserData(user)) {
    return res.send({ message: `Unable to ${method} task` });
  }
  let result = false;
  switch (method) {
    case "delete":
      result = dataHandler.deleteTask(user, taskText);
      return res.send({ message: "Task deleted.", result: result });
    case "modify":
      result = dataHandler.modifyTask(user, taskText, newTask);
      return res.send({ message: "Task modified successfully.", result: result });
    case "add":
      result = dataHandler.addTask(user, taskText, category);
      return res.send({ message: "Task added successfully.", result: result });
    case "deleteAll":
      result = dataHandler.deleteAllTasks(user);
      return res.send({ message: "All tasks deleted successfully.", result: result });
    case "toggle":
      result = dataHandler.toggleTaskCompletion(user, taskText);
      return res.send({ message: "Toggle completed.", result: result });
  }
});
//Send the user categories list.
server.get("/user/:user/category", (req, res) => {
  let user = req.params.user;
  res.send({ data: dataHandler.getCategories(user) });
});

//Receives the user new category, or category deletion.
server.post("/user/:user/category", (req, res) => {
  let user = req.params.user;
  if (!req.user || user != req.user) {
    res.send({ data: dataHandler.getCategories(user), error: "Not your todo list." });
    return;
  }
  let category = req.body.category;
  let removeCategory = req.body.removeCategory;
  if (removeCategory) dataHandler.removeCategory(user, category);
  else {
    dataHandler.addCategory(user, category);
  }
  res.send({ data: dataHandler.getCategories(user) });
});

//Logs out the user and deletes the cookie.
server.get("/logout", (req, res) => {
  res.clearCookie("account");
  res.send({ worked: true });
});

//Send the public css and js to the frontend.
server.use(express.static("public"));

//Uknown routing defaults back to home route.
server.get("/*", (req, res) => {
  res.redirect("/");
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
