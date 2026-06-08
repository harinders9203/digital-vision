(() => {
    const SUBMITTING_LABEL = "Sending...";
    const DEFAULT_LABEL = "Send Message";

    async function handleWeb3FormsSubmit(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const status = form.querySelector("[data-form-status]");
        const originalLabel = submitButton ? submitButton.textContent.trim() || DEFAULT_LABEL : DEFAULT_LABEL;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = SUBMITTING_LABEL;
        }

        if (status) {
            status.hidden = false;
            status.dataset.state = "pending";
            status.textContent = "Sending your message...";
        }

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method || "POST",
                headers: {
                    Accept: "application/json"
                },
                body: formData
            });

            const contentType = response.headers.get("content-type") || "";
            const result = contentType.includes("application/json")
                ? await response.json()
                : null;

            if (!response.ok || (result && !result.success)) {
                throw new Error(result?.message || "We couldn't send your message right now.");
            }

            form.reset();

            if (status) {
                status.dataset.state = "success";
                status.textContent = "Thanks. Your message has been sent successfully.";
            }
        } catch (error) {
            if (error instanceof TypeError) {
                HTMLFormElement.prototype.submit.call(form);
                return;
            }

            if (status) {
                status.dataset.state = "error";
                status.textContent = error.message || "Something went wrong. Please try again.";
            }

            console.error("Web3Forms submission failed:", error);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }
        }
    }

    document.addEventListener("submit", (event) => {
        const form = event.target;

        if (!(form instanceof HTMLFormElement) || !form.matches("[data-web3forms]")) {
            return;
        }

        event.preventDefault();
        handleWeb3FormsSubmit(form);
    });
})();
