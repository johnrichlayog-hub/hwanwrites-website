const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});

function openImage(imageSource) {

    const viewer = document.getElementById("image-viewer");
    const viewerImage = document.getElementById("viewer-image");

    viewerImage.src = imageSource;

    viewer.classList.add("active");
}

function closeImage() {

    const viewer = document.getElementById("image-viewer");

    viewer.classList.remove("active");
}

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeImage();
    }

});

const imageViewer = document.getElementById("image-viewer");

if (imageViewer) {
    imageViewer.addEventListener("click", function (event) {

        if (event.target === this) {
            closeImage();
        }

    });
}

/* ================================
   PREMIUM SCROLL REVEAL
   ================================ */

const revealElements = document.querySelectorAll(
    ".section-heading, .service-card, .process-card, .feature-card, .portfolio-card, .milestone-card, .tools-group, .certificate-card"
);

revealElements.forEach(function (element, index) {
    element.classList.add("reveal");

    if (index % 3 === 1) {
        element.classList.add("reveal-delay-1");
    } else if (index % 3 === 2) {
        element.classList.add("reveal-delay-2");
    }
});

const revealObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});