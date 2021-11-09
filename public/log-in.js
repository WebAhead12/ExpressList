const searchInput = document.getElementById("search-user");
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("pass");
const searchBtn = document.querySelector(".search-button");
const signInBtn = document.querySelector("#sign-in")
const alert = document.querySelector('.alert-box');


searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    searchBtn.click();
  }
});

userInput.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    signInBtn.click();
  }
});

passwordInput.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    signInBtn.click();
  }
});


searchBtn.addEventListener("click", (event) => {
  console.log("something");
});

signInBtn.addEventListener("click", (event) => {
  fetch('../', {
    method: "POST",
    body: JSON.stringify({ "user": userInput.value, "password": passwordInput.value }),
    headers: { "content-type": "application/json" },
  })

    .then(response => {
      if (!response.ok) throw new Error(response.status);
      console.log(response);

      return response;
    }).then(json => {
      console.log("reached")
      passwordInput.value = ''
      setTimeout(() => {
        passwordInput.style.background = 'white'
        passwordInput.placeholder = "New task!"
      }, 2500)
      passwordInput.style.background = 'Aquamarine'
      passwordInput.placeholder = "Wrong password!"
      alert.innerText = '';
    })
    .catch(error => alert.innerText = "An error has occured")
});

