const searchInput = document.getElementById("search-user");
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("pass");
const searchBtn = document.querySelector(".search-button");
const signInBtn = document.querySelector("#sign-in");
const alert = document.querySelector(".alert-box");

//Attempt search when clicking enter while typing name.
searchInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});
//Attempts search when clicking button.
searchBtn.addEventListener("click", (event) => {
  fetch(`/user/search/${searchInput.value}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((json) => {
      if (json.error) {
        setTimeout(() => {
          searchInput.style.background = "white";
          searchInput.placeholder = "Enter Username Here";
        }, 1000);
        searchInput.style.background = "PaleGoldenrod";
        searchInput.placeholder = json.error;
      }
      if (json.user) window.location.href = `/user/${json.user}`;
    })
    .catch((error) => {
      searchInput.value = "";
      setTimeout(() => {
        searchInput.style.background = "white";
        searchInput.placeholder = "Enter Username Here";
      }, 1000);
      searchInput.style.background = "PaleGoldenrod";
      searchInput.placeholder = "An error has occured";
    });
  searchInput.value = "";
});

//Attempt login when clicking enter while typing name.
userInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    signInBtn.click();
  }
});
//Attempt login when clicking enter while typing password.
passwordInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    signInBtn.click();
  }
});
//Logs in and check name/password are correct.
signInBtn.addEventListener("click", (event) => {
  fetch("/", {
    method: "POST",
    body: JSON.stringify({ user: userInput.value, password: passwordInput.value }),
    headers: { "content-type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((json) => {
      if (json.error) {
        passwordInput.value = "";
        setTimeout(() => {
          passwordInput.style.background = "white";
          passwordInput.placeholder = "Password";
        }, 1000);
        passwordInput.style.background = "PaleGoldenrod";
        passwordInput.placeholder = "Wrong password!";
        alert.innerText = "";
        return;
      }
      if (json.user) window.location.href = `/user/${json.user}`;
    })
    .catch((error) => (alert.innerText = "An error has occured"));
});
