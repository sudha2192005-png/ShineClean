
const REGISTER_KEY = "shineCleanUsers";


function showSuccessPopup(title, description, buttonText, onContinue) {
    const overlay = document.createElement("div");
    overlay.className = "success-overlay";

    overlay.innerHTML = `
        <div class="success-popup" role="dialog"
             aria-modal="true" aria-labelledby="successTitle">
            <div class="success-icon" aria-hidden="true">✓</div>
            <h2 id="successTitle"></h2>
            <p class="success-description"></p>
            <button type="button" class="success-continue"></button>
        </div>
    `;

    overlay.querySelector("h2").textContent = title;
    overlay.querySelector(".success-description").textContent = description;
    overlay.querySelector(".success-continue").textContent = buttonText;

    document.body.appendChild(overlay);

    overlay.querySelector(".success-continue").addEventListener("click", () => {
        overlay.remove();
        onContinue();
    });
}


// CREATE ACCOUNT
const registerForm = document.getElementById("userRegisterForm");

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const mobile = document.getElementById("registerMobile").value.trim();
        const address = document.getElementById("registerAddress").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        const users = JSON.parse(localStorage.getItem(REGISTER_KEY) || "[]");

        if (users.some(user => user.mobile === mobile)) {
            message.textContent = "This mobile number already has an account.";
            return;
        }

        users.push({ name, mobile, address, password });
        localStorage.setItem(REGISTER_KEY, JSON.stringify(users));

        showSuccessPopup(
    "Account Created!",
    "Your ShineClean account has been created successfully. Please login to continue.",
    "Continue to Login",
    () => {
        window.location.href = "user-login.html";
    }
);
    });
}

// USER LOGIN
const loginForm = document.getElementById("userLoginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const mobile = document.getElementById("loginMobile").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const users = JSON.parse(localStorage.getItem(REGISTER_KEY) || "[]");
        const user = users.find(
            item => item.mobile === mobile && item.password === password
        );

        if (!user) {
            message.textContent = "Invalid mobile number or password.";
            return;
        }

        localStorage.setItem("shineCleanLoggedInUser", JSON.stringify({
            name: user.name,
            mobile: user.mobile,
            address: user.address
        }));

       showSuccessPopup(
    "Login Successful!",
    "Welcome to ShineClean, " + user.name + "! You can now manage your cleaning services.",
    "Continue to Booking",
    () => {
        window.location.href = "book-cleaning.html";
    }
);
    }); 
}
