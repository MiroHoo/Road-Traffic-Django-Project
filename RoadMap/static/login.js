
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
async function logout(){
    const csrfToken = getCookie('csrftoken');
    await fetch("http://127.0.0.1:8000/logout/",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': csrfToken
            },
        mode: 'same-origin',
    })
    .then((response) => response.json())
    .then((data) => {
        if(data){
            popupwtext("Succesfully logged out!")
            setlogout()
        } else {
            popupwtext("Something failed!")
        }
    })
    .catch((error) => popupwtext("There was an error with the connetion, we apologise!"))
}
async function loginbutton(){
    const form = new FormData(document.getElementById("loginform"))
    console.log(form.get("Uname") +"  " + form.get("Psw"))
    const csrfToken = getCookie('csrftoken');
    const JSONDATA = JSON.stringify({username: form.get("Uname"), password: form.get("Psw")})
    console.log("login")
    await fetch("http://127.0.0.1:8000/auth/",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': csrfToken
            },
        mode: 'same-origin',
        body: JSONDATA
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data["response"])
        if(data["response"]){
            console.log("success")
            popupwtext("Welcome back " + data["username"] + "!")  
            if(document.getElementById("Logout_burger").style.display != "block"){
                setlogout()
            }   
        } else {
            console.log("failed!")
            popupwtext("Login failed!")
        }
    })
    .catch((error) => popupwtext("There was an error with the connetion, we apologise!"))
}
function setlogout(){
    
    if(document.getElementById("Logout_burger").style.display != "block"){
        document.getElementById("Logout_burger").style.display = "block"
        document.getElementById("Logout_burger").style.zIndex = 
        document.getElementById("Login_burger").style.display = "none"
    } else {
        document.getElementById("Login_burger").style.display = "block"
        document.getElementById("Logout_burger").style.display = "none"
    }
}
async function registerbutton(){
    const form = new FormData(document.getElementById("registerform"))
    console.log( form.get("Psw") + "    " + form.get("Psw2"))
    emailcheck = await checkemail(form.get("Email"))
    password = await passwordcheck(form.get("Psw"),form.get("Psw2"))
    console.log(emailcheck)
    console.log(password["pass"])
    if(form.get("Uname").length > 1 && form.get("Psw").length > 6 && emailcheck && password["pass"]) {
        const csrfToken = getCookie('csrftoken');
        const JSONDATA = JSON.stringify({username: form.get("Uname"), password: form.get("Psw"), email: form.get("Email")})
        console.log("login")
        await fetch("http://127.0.0.1:8000/reg/",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
                'X-CSRFToken': csrfToken
                },
            mode: 'same-origin',
            body: JSONDATA
        }
        )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if(data["response"]){
                popupwtext("Thank you for registering! Please Login")
                document.getElementById("registerform").reset()
                closeelement()
            } else {
                console.log("failed!")
                popupwtext("Register failed!")
            }
        })
    } else {
        if(password["pass"] == false) {
            popupwtext(password["error"])
        } else if (emailcheck == false) {
            popupwtext("Incorrect email adress!")
        } else {
            popupwtext("Username field is empty!")  
        }
        }
    }

async function checkemail(email){
    if(email.includes("@") && email.includes(".") && email.length > 5){
        return true
    } else {
        return false
    }
}
async function passwordcheck(password, password2){
    pass = false
    error = ""
    if(password != password2){
        error = "Passwords do not match!"
    } else if (password.length < 6){
        error = "Password must be longer than 5 chacters!"
    } else if (password.toLowerCase() == password) {
        error = "Password must include atleast one capital letter!"
    } else {
        pass = true
    }
    return {"pass": pass ,"error":error}
}
function register(){
    const registerform = document.getElementById("registerform")
    const loginform = document.getElementById("loginform")
    if(registerform.classList == "registerform hidden"){
        loginform.classList.remove("shown")
        loginform.classList.add("hidden")
        registerform.classList.remove("hidden")
        registerform.classList.add("shown")
    } else {
        loginform.classList.remove("hidden")
        loginform.classList.add("shown")
        registerform.classList.remove("shown")
        registerform.classList.add("hidden")
    }
}
function closeelement(){
    const overlay = document.getElementById("overlay")
    console.log(overlay)
    if(overlay.classList == "overlay hidden"){
    console.log("here2")
    overlay.classList.remove("hidden")
    overlay.classList.add("shown")
    overlay.style.visibility = "visible"
    overlay.style.zIndex = "400"   
    onanimationend = () => {
        overlay.style.visibility = "visible",
        overlay.style.zIndex = "400"   
    }
    } else {
    overlay.classList.remove("shown")
    overlay.classList.add("hidden")
    onanimationend = () => {
        overlay.style.visibility = "hidden",
        overlay.style.zIndex = "1"   
    }
    }
}

function popupwtext(text){
    console.log("here")
    const popup = document.getElementById("popupoverlay")
    document.getElementById('popuptext').innerText = text
    popup.classList.remove("hidden")
    popup.classList.add("shown")
    onanimationend = () => {
        popup.style.visibility = "visible",
        popup.style.zIndex = "401"   
    }
    setTimeout(() => {
        popup.classList.remove("shown")
        popup.classList.add("hidden")
        onanimationend = () => {
            popup.style.visibility = "hidden",
            popup.style.zIndex = "1"   
        }
    }, 3000);
}