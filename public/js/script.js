var loginError = document.getElementById('errorLogin');
var signUpError = document.getElementById('errorSignUp');

if (!email == false || !password == false) {
    loginError.innerHTML = '';
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
  
function pageRedirect() {
    sleep(500).then(() => { window.location.replace("/dashboard"); });
};

function RedirectToIndex() {
    window.location.replace("/");
};

