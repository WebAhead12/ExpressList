const express = require("express");
const PORT = process.env.PORT || 3000;
const path = require("path");
const cookiePraser = require("cookie-parser");
const authHandler = require(path.join(__dirname, "authentication-handler"));
const dataHandler = require(path.join(__dirname, "data-handler"))

const server = express();
server.use(express.static("public"));
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
  let account = authHandler.getTokenUser(req.cookies.account);
  if (account.user) {
    res.redirect(`/${account.user}`);
    return;
  }
  res.sendFile(path.join(__dirname, "public", "log-in.html"));
});

//Logins the user.
server.post("/", (req, res) => {
  const account = req.body;
  const token = authHandler.tokenifyAccount(account);
  res.cookie("account", token, { maxAge: 600000 });
  if (!authHandler.getTokenUser(token)) {
    res.send("Password incorrect.");
    return;
  }
  res.redirect(`/${account.user}`);
});

//Sends the user his todolist page.
server.get("/:user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Sends the user his todolist data.
server.get("/:user/data", (req, res) => {});

//Receives the user new todolist data.
server.post("/:user", (req, res) => {});

//Receives the user new category, or category deletion.
server.post("/:user/category", (req, res) => {
    let user = ;
    if(!req.user){
        res.send({message: "Not your todo list."})
        return;
    }

    if(!req.user || (user != req.user)){
        res.send({message: "Not your todo list."})      
        return;
    }
    let category = req.body.category
    let removeCategory = req.body.removeCategory;
    if(removeCategory)
        dataHandler.removeCategory(user, category)
    else{
        dataHandler.addCategory(user, category)
    }
    res.send(dataHandler.getCategories(user))
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
