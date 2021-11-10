const searchInput = document.getElementById("search-user");
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("pass");
const searchBtn = document.querySelector(".search-button");
const signInBtn = document.querySelector("#sign-in");
const alert = document.querySelector(".alert-box");

searchInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

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

userInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    signInBtn.click();
  }
});

passwordInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    signInBtn.click();
  }
});

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
