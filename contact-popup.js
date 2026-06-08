(() => {
    const contactTriggers = document.querySelectorAll("[data-contact-trigger]");
    const siteNav = document.querySelector(".nav");
    const siteMenuToggle = document.querySelector(".menu-toggle");

    if (!contactTriggers.length) {
        return;
    }

    const modal = document.createElement("div");
    modal.className = "contact-modal";
    modal.id = "contact-popup";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "contact-popup-title");

    modal.innerHTML = `
        <div class="contact-modal__panel">
            <button class="contact-modal__close" type="button" aria-label="Close contact form" data-contact-close>&times;</button>
            <p class="contact-modal__eyebrow">Let's Talk</p>
            <h2 class="contact-modal__title" id="contact-popup-title">Tell us about your project.</h2>
            <p class="contact-modal__description">Share a few details and our team will get back to you with the next steps.</p>
            <form class="contact-modal__form" action="https://api.web3forms.com/submit" method="post" data-web3forms>
                <input type="hidden" name="access_key" value="6b1fbc25-6c96-45a9-8428-96580a9ae508">
                <input type="hidden" name="subject" value="New popup enquiry from Digital Vision Group">
                <input type="hidden" name="from_name" value="Digital Vision Group Website">
                <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" hidden>

                <label class="contact-modal__label" for="contact-popup-name">Name</label>
                <input class="contact-modal__input" type="text" id="contact-popup-name" name="name" placeholder="Your full name" required>

                <label class="contact-modal__label" for="contact-popup-email">Email</label>
                <input class="contact-modal__input" type="email" id="contact-popup-email" name="email" placeholder="you@example.com" required>

                <label class="contact-modal__label" for="contact-popup-message">Message</label>
                <textarea class="contact-modal__textarea" id="contact-popup-message" name="message" placeholder="Tell us what you need help with." required></textarea>

                <button class="contact-modal__submit" type="submit">Send Message</button>
                <p class="form-status contact-modal__status" data-form-status hidden aria-live="polite"></p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector("[data-contact-close]");
    const firstInput = modal.querySelector("#contact-popup-name");
    let previousActiveElement = null;
    let currentTrigger = null;

    function setExpandedState(value) {
        contactTriggers.forEach((trigger) => {
            trigger.setAttribute("aria-expanded", String(value));
        });
    }

    function openModal(trigger) {
        previousActiveElement = document.activeElement;
        currentTrigger = trigger;

        if (siteNav && siteNav.classList.contains("menu-open")) {
            siteNav.classList.remove("menu-open");
        }

        if (siteMenuToggle) {
            siteMenuToggle.setAttribute("aria-expanded", "false");
        }

        modal.classList.add("is-open");
        document.body.classList.add("modal-open");
        setExpandedState(true);

        if (firstInput) {
            firstInput.focus();
        }
    }

    function closeModal() {
        modal.classList.remove("is-open");
        document.body.classList.remove("modal-open");
        setExpandedState(false);

        if (currentTrigger instanceof HTMLElement) {
            currentTrigger.focus();
        } else if (previousActiveElement instanceof HTMLElement) {
            previousActiveElement.focus();
        }
    }

    contactTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => openModal(trigger));
    });

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
})();
