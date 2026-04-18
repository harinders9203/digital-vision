const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
const prev = document.querySelector(".left");
const next = document.querySelector(".right");
const slider = document.querySelector("#slider");
const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");

let index = 0;

if (slides.length && dotsContainer && prev && next && slider) {
    let autoPlayId = null;

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayId = window.setInterval(nextSlide, 5500);
    }

    function stopAutoPlay() {
        if (autoPlayId) {
            window.clearInterval(autoPlayId);
            autoPlayId = null;
        }
    }

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);

        if (i === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            showSlide(i);
            startAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function showSlide(i) {
        slides[index].classList.remove("active");
        dots[index].classList.remove("active");

        index = i;

        slides[index].classList.add("active");
        dots[index].classList.add("active");
    }

    function nextSlide() {
        const i = (index + 1) % slides.length;
        showSlide(i);
    }

    function prevSlide() {
        const i = (index - 1 + slides.length) % slides.length;
        showSlide(i);
    }

    next.addEventListener("click", () => {
        nextSlide();
        startAutoPlay();
    });

    prev.addEventListener("click", () => {
        prevSlide();
        startAutoPlay();
    });

    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);
    slider.addEventListener("focusin", stopAutoPlay);
    slider.addEventListener("focusout", startAutoPlay);

    startAutoPlay();
}

if (nav && menuToggle && menu) {
    function closeMenu() {
        nav.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}
