(() => {
    const loginForm = document.querySelector("[data-admin-login-form]");
    const loginStatus = document.querySelector("[data-login-status]");
    const submitButton = document.querySelector("[data-login-submit]");
    const loginUrl = "/api/auth/login";
    const sessionUrl = "/api/auth/me";
    const dashboardUrl = "/admin";

    if (!(loginForm instanceof HTMLFormElement)) {
        return;
    }

    function setStatus(message = "", state = "info") {
        if (!(loginStatus instanceof HTMLElement)) {
            return;
        }

        if (!message) {
            loginStatus.hidden = true;
            loginStatus.textContent = "";
            delete loginStatus.dataset.state;
            return;
        }

        loginStatus.hidden = false;
        loginStatus.dataset.state = state;
        loginStatus.textContent = message;
    }

    async function readJson(response) {
        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return {};
        }

        try {
            return await response.json();
        } catch {
            return {};
        }
    }

    async function checkExistingSession() {
        try {
            const response = await fetch(sessionUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                credentials: "same-origin"
            });

            if (response.ok) {
                window.location.replace(dashboardUrl);
            }
        } catch {
            // A failed preflight check should not block the login form.
        }
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usernameField = loginForm.elements.namedItem("username");
        const passwordField = loginForm.elements.namedItem("password");

        const username = String(usernameField?.value || "").trim();
        const password = String(passwordField?.value || "");

        if (!username || !password) {
            setStatus("Enter both your username and password.", "error");
            return;
        }

        if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = true;
            submitButton.textContent = "Signing in...";
        }

        setStatus("Checking your credentials...", "info");

        try {
            // The password is only posted to the backend auth endpoint over same-origin requests.
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({ username, password })
            });

            const payload = await readJson(response);

            if (!response.ok) {
                setStatus(payload.error || "We couldn't sign you in.", "error");

                if (passwordField instanceof HTMLInputElement) {
                    passwordField.value = "";
                    passwordField.focus();
                }
                return;
            }

            window.location.assign(payload.redirectTo || dashboardUrl);
        } catch {
            setStatus("The server could not be reached. Please try again.", "error");
        } finally {
            if (submitButton instanceof HTMLButtonElement) {
                submitButton.disabled = false;
                submitButton.textContent = "Sign in";
            }
        }
    });

    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason === "session-expired") {
        setStatus("Your session expired. Please sign in again.", "info");
    }

    checkExistingSession();
})();
