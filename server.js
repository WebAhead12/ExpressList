const express = require("express");
const PORT = process.env.PORT || 3000;
const path = require("path");
const cookiePraser = require("cookie-parser");
const { send } = require("process");
const authHandler = require(path.join(__dirname, "authentication-handler"));
const dataHandler = require(path.join(__dirname, "data-handler"));

const server = express();

server.use(express.json());
server.use(cookiePraser());

//Handles the user login cookies.
server.use((req, res, next) => {
  const token = req.cookies.account;
  if (token) {
    const user = authHandler.getTokenUser(token);
    if (user != undefined) req.user = user;
  }
  next();
});

//Checks if the user is logged in (through cookies) and redirects them to their page, else to login
server.get("/", (req, res) => {
  if (req.cookies.account) {
    let account = authHandler.getTokenUser(req.cookies.account);
    if (account) {
      res.redirect(`/user/${account}`);
      return;
    }
  }
  res.sendFile(path.join(__dirname, "public", "log-in.html"));
});

//Logins the user.
server.post("/", (req, res) => {
  const account = req.body;
  const token = authHandler.tokenifyAccount(account);
  res.cookie("account", token, { maxAge: 600000 });
  if (!authHandler.getTokenUser(token)) {
    res.send({ error: "Password incorrect." });
    return;
  }
  res.send({ user: account.user });
});

//Sends the user his todolist page.
server.get("/user/:user", (req, res) => {
  let account = dataHandler.checkUserLoginData(req.params.user);
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

server.get("/user/:user/data/:type", (req, res) => {
  console.log("object");
  let type = req.params.type;
  let user = req.params.user;
  userData = dataHandler.getUserData(user);
  if (!userData) {
    res.send([]);
    return;
  }
  switch (type) {
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

//Sends the user his todolist data.
server.get("/user/:user/data/:type/:category", (req, res) => {
  console.log("object");
  let type = req.params.type;
  let user = req.params.user;
  let category = req.params.category;
  userData = dataHandler.getUserData(user);
  if (userData.categories.includes(category)) {
    let choosenCategory = userData.list.filter((tasks) => tasks.categories == category);
    switch (type) {
      case "completed":
        let completed = choosenCategory.list.filter((tasks) => tasks.completed);
        res.send(completed);
        return;
      case "incomplete":
        let incomplete = choosenCategory.list.filter((tasks) => !tasks.completed);
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
  let category = req.body.category;
  let taskText = req.body.taskText;
  switch (method) {
    case 'delete':
      if (!deleteTask(user, taskText))
        return res.send({ message: "unable to delete task" });
      return res.send({ message: "task deleted" });
    case 'modify':
      let newTask = req.body.newTaskText;
      if (!modifyTask(user, taskText, newTask))
        return res.send({ message: "user doesn't exist OR taskText is equal to the new modefied text" });
      return res.send({ message: "task modified successfully" });
    case 'add':
      if (!addTask(user, taskText, category))
        return res.send({ message: "failed to add task, task already exist" });
      return res.send({ message: "task changed successfully" });
    case 'deleteAll':
      if (!deleteAllTasks(user))
        return res.send({ message: "user doesn't exist" });
      return res.send({ message: "all task deleted successfully" });
    case 'toggle':
      if (!toggleTaskCompletion(user, taskText))
        return res.send({ message: "user doesn't exist" });
  }
});

//Receives the user new category, or category deletion.
server.post("/user/:user/category", (req, res) => {
  let user = req.params.user;
  if (!req.user || user != req.user) {
    res.send({ error: "Not your todo list." });
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

server.get("/logout", (req, res) => {
  res.clearCookie("account");
  res.send({ worked: true });
});

server.use(express.static("public"));

server.get("/*", (req, res) => {
  res.redirect("/");
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
