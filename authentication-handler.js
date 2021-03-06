const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const dataPath = path.join(__dirname, "data");
let accountsList = require(path.join(dataPath, "accounts.json"));

const SECRET = "fnioeabnod2qjpidj21i0";

// Updates the accounts data file.
function saveList() {
  fs.writeFileSync(path.join(dataPath, "accounts.json"), JSON.stringify(accountsList, undefined, 2));
}

// Gets the user object from data.
function getUserObject(user) {
  return accountsList.find((element) => element["user"].toLowerCase() === user.toLowerCase());
}
// Adds a new account to the data.
function newAccount(user, password) {
  if (getUserObject(user)) return false;
  accountsList.push({ user: user, password: password });
  saveList();
  return true;
}

// Return the account user if it exists and checks if the account matches the password.;
function getAccountUser(user, password) {
  if (getUserObject(user)) if (getUserObject(user)["password"] == password) return user;
  return undefined;
}

// Returns a tokenified account.
function tokenifyAccount(account) {
  newAccount(account.user, account.password);
  return jwt.sign(account, SECRET);
}

// Return the account associated with the token.
function checkRegisteredUser(token) {
  let tempAcc = jwt.verify(token, SECRET);
  return getAccountUser(tempAcc["user"], tempAcc["password"]);
}

module.exports = {
  checkRegisteredUser,
  tokenifyAccount,
};
