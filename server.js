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

//Sends the user his todolist data.
server.get("/user/:user/data", (req, res) => {
  req.params.user;
});

//Receives the user new todolist data.
server.post("/user/:user", (req, res) => {});

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

server.use(express.static("public"));

server.get("/*", (req, res) => {
  res.redirect("/");
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
