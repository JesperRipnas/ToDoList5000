// FUNCTION TO SET A DELAY IF NEEDED
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// USE THE SLEEP FUNCTION AND REDIRECT TO DASHBOARD
function pageRedirect() {
    sleep(500).then(() => { window.location.replace("/dashboard"); });
};

// REDIRECT TO FRONT PAGE / (INDEX)
function RedirectToIndex() {
    window.location.replace("/");
};

// CALL FOR THE FUNCTION IN THE API TO REDIRECT USER BACK TO LOGIN PAGE
// REMOVES TOKEN STORED IN COOKIES FROM BROWSER
function removeCookiesAndLogout() {
    window.location.replace("/api/user/logout");
};

// FUNCTION FOR SIGN UP PAGE, WHEN USER HAS FILLED IN ALL INFO AND PRESS SIGN UP
// REMOVES ALL THE FIELDS AND WILL RESPOND WITH "ACCOUNT CREATED"
// TBA: SHOULD GIVE AN ERROR IF API RESPONS IS EMAIL ALREADY EXIST OR ANYTHING ELSE IS INCORRECT
function removeForm() {
    var sumbitBtn = document.getElementById('sumbitBtn');
    var fontUser = document.getElementById('fontUser');
    var fontUserTwo = document.getElementById('fontUserTwo');
    var fontLock = document.getElementById('fontLock');
    var formName = document.getElementById('name');
    var formPassword = document.getElementById('password');
    var formEmail = document.getElementById('email');

    sumbitBtn.parentNode.removeChild(sumbitBtn);
    formName.parentNode.removeChild(formName);
    formPassword.parentNode.removeChild(formPassword);
    formEmail.parentNode.removeChild(formEmail);
    fontUser.parentNode.removeChild(fontUser);
    fontUserTwo.parentNode.removeChild(fontUserTwo);
    fontLock.parentNode.removeChild(fontLock);
    document.getElementById("msg").innerHTML = "Account created!";
  };
