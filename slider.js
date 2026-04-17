const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
const prev = document.querySelector(".left");
const next = document.querySelector(".right");

let index = 0;

if (slides.length && dotsContainer && prev && next) {
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        dot.type = "button";

        if (i === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => showSlide(i));
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

    next.addEventListener("click", nextSlide);
    prev.addEventListener("click", prevSlide);

    setInterval(nextSlide, 5000);
}
