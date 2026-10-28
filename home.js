
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const loginMenu = document.getElementById("loginMenu");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    // Login dropdown open / close
    if (loginButton && loginMenu) {
        loginButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = loginMenu.classList.toggle("show");

            loginButton.setAttribute("aria-expanded", String(isOpen));
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".login-dropdown")) {
                loginMenu.classList.remove("show");
                loginButton.setAttribute("aria-expanded", "false");
            }
        });

        // Close dropdown with Escape key
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                loginMenu.classList.remove("show");
                loginButton.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Mobile navbar toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("mobile-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close mobile menu after selecting a link
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("mobile-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
                menuToggle.textContent = "☰";
            });
        });

        // Reset mobile menu when switching to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                navLinks.classList.remove("mobile-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            }
        });
    }
});
