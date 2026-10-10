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

/* =========================================
   FLOATING CERTIFICATE CAROUSEL
   ========================================= */

const certificateDock = document.querySelector(".certificate-dock");
const certificateToggle = document.getElementById("certificate-toggle");
const certificateClose = document.getElementById("certificate-close");
const certificateSlides = document.querySelectorAll(".certificate-slide");
const certificatePrev = document.getElementById("certificate-prev");
const certificateNext = document.getElementById("certificate-next");
const certificateCounter = document.getElementById("certificate-counter");
const certificateCarousel = document.getElementById("certificate-carousel");

const viewerImage = document.getElementById("viewer-image");

const certificateViewerPrev = document.getElementById("certificate-viewer-prev");
const certificateViewerNext = document.getElementById("certificate-viewer-next");
const certificateViewerCounter = document.getElementById("certificate-viewer-counter");

let currentCertificate = 0;
let viewerCertificate = 0;

/* SHOW CERTIFICATE IN PREVIEW */

function showCertificate(index) {
    if (!certificateSlides.length) return;

    if (index < 0) {
        currentCertificate = certificateSlides.length - 1;
    } else if (index >= certificateSlides.length) {
        currentCertificate = 0;
    } else {
        currentCertificate = index;
    }

    certificateSlides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === currentCertificate);
    });

    if (certificateCounter) {
        certificateCounter.textContent =
            (currentCertificate + 1) + " / " + certificateSlides.length;
    }
}

/* OPEN LARGE CERTIFICATE VIEWER */

function openCertificateViewer(index) {

    if (!certificateSlides.length || !imageViewer || !viewerImage) {
        return;
    }

    if (index < 0) {
        viewerCertificate = certificateSlides.length - 1;
    } else if (index >= certificateSlides.length) {
        viewerCertificate = 0;
    } else {
        viewerCertificate = index;
    }

    const certificateImage =
        certificateSlides[viewerCertificate].querySelector("img");

    if (!certificateImage) return;

    viewerImage.src = certificateImage.src;
    viewerImage.alt = certificateImage.alt;

    if (certificateViewerCounter) {
        certificateViewerCounter.textContent =
            (viewerCertificate + 1) + " / " + certificateSlides.length;
    }

    imageViewer.classList.add("active");
}

    if (certificateViewerPrev) {
    certificateViewerPrev.addEventListener("click", function (event) {
        event.stopPropagation();
        previousViewerCertificate();
    });
}

if (certificateViewerNext) {
    certificateViewerNext.addEventListener("click", function (event) {
        event.stopPropagation();
        nextViewerCertificate();
    });
}

/* NEXT CERTIFICATE IN LARGE VIEWER */

function nextViewerCertificate() {
    openCertificateViewer(viewerCertificate + 1);
}

/* PREVIOUS CERTIFICATE IN LARGE VIEWER */

function previousViewerCertificate() {
    openCertificateViewer(viewerCertificate - 1);
}

/* CERTIFICATE BUTTON */

if (certificateToggle && certificateDock) {

    certificateToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        certificateDock.classList.add("open");
    });

    document.addEventListener("click", function (event) {

        if (!certificateDock.contains(event.target)) {
            certificateDock.classList.remove("open");
        }

    });
}

/* PREVIEW NAVIGATION */

if (certificatePrev) {
    certificatePrev.addEventListener("click", function (event) {
        event.stopPropagation();
        showCertificate(currentCertificate - 1);
    });
}

if (certificateNext) {
    certificateNext.addEventListener("click", function (event) {
        event.stopPropagation();
        showCertificate(currentCertificate + 1);
    });
}

/* CLICK CERTIFICATE PREVIEW */

certificateSlides.forEach(function (slide, index) {

    const image = slide.querySelector("img");

    if (image) {
        image.onclick = function (event) {
            event.stopPropagation();

            viewerCertificate = index;
            openCertificateViewer(viewerCertificate);
        };
    }

});

/* SWIPE SUPPORT FOR PREVIEW */

let certificateTouchStartX = 0;
let certificateTouchEndX = 0;

if (certificateCarousel) {

    certificateCarousel.addEventListener("touchstart", function (event) {
        certificateTouchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    certificateCarousel.addEventListener("touchend", function (event) {

        certificateTouchEndX = event.changedTouches[0].screenX;

        const swipeDistance =
            certificateTouchEndX - certificateTouchStartX;

        if (Math.abs(swipeDistance) < 40) {
            return;
        }

        if (swipeDistance < 0) {
            showCertificate(currentCertificate + 1);
        } else {
            showCertificate(currentCertificate - 1);
        }

    }, { passive: true });
}

/* LARGE VIEWER KEYBOARD NAVIGATION */

document.addEventListener("keydown", function (event) {

    if (!imageViewer || !imageViewer.classList.contains("active")) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextViewerCertificate();
    }

    if (event.key === "ArrowLeft") {
        previousViewerCertificate();
    }

});

/* SWIPE SUPPORT FOR LARGE VIEWER */

let viewerTouchStartX = 0;
let viewerTouchEndX = 0;

if (imageViewer) {

    imageViewer.addEventListener("touchstart", function (event) {
        viewerTouchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    imageViewer.addEventListener("touchend", function (event) {

        viewerTouchEndX = event.changedTouches[0].screenX;

        const swipeDistance =
            viewerTouchEndX - viewerTouchStartX;

        if (Math.abs(swipeDistance) < 40) {
            return;
        }

        if (swipeDistance < 0) {
            nextViewerCertificate();
        } else {
            previousViewerCertificate();
        }

    }, { passive: true });
}

showCertificate(0);

/* =========================================
   INTERACTIVE SERVICE DETAILS
   ========================================= */

const serviceDetails = {
    research: {
        number: "01",
        title: "Research Assistance",
        items: [
            "Research Title and Topic Assistance",
            "Research Proposal Support",
            "Questionnaire Construction",
            "Data Encoding and Cleaning",
            "Statistical Analysis",
            "Research Writing and Formatting",
            "APA 7 Formatting",
            "Reference and Citation Checking",
            "Research Presentation and Defense PPT"
        ]
    },

    academic: {
        number: "02",
        title: "Academic Services",
        items: [
            "Essays",
            "Reflection and Reaction Papers",
            "Position and Critique Papers",
            "Case Studies",
            "Concept Papers",
            "Academic Reports",
            "Presentation Slides",
            "Proofreading and Editing",
            "Paraphrasing and Academic Formatting"
        ]
    },

    documents: {
        number: "03",
        title: "Professional Documents",
        items: [
            "Resume and CV",
            "Cover and Application Letters",
            "Letters of Intent and Request",
            "Personal Statements and SOPs",
            "Business Plans",
            "Event Plans",
            "Professional Presentations",
            "Document Formatting and Organization"
        ]
    },

    web: {
        number: "04",
        title: "Web Development",
        items: [
            "Landing Pages",
            "Portfolio Websites",
            "HTML and CSS Development",
            "JavaScript Interactions",
            "Responsive Website Layouts",
            "Website Styling and Customization",
            "Basic Website Setup and Deployment"
        ]
    },

    design: {
        number: "05",
        title: "Graphic Design",
        items: [
            "Pubmats",
            "Social Media Graphics",
            "Posters and Flyers",
            "Presentation Design",
            "Branding Materials",
            "Promotional Visuals",
            "Simple Layout and Visual Design"
        ]
    },

    more: {
        number: "06",
        title: "and Many More",
        items: [
            "Content Creation",
            "Digital Marketing Assistance",
            "Presentation Design",
            "Creative and Digital Projects",
            "Custom Document Requests",
            "Other project-based assistance"
        ]
    }
};

const serviceCards = document.querySelectorAll(".service-card-interactive");
const serviceDetailsBox = document.getElementById("service-details");
const serviceDetailsClose = document.getElementById("service-details-close");
const serviceDetailsNumber = document.getElementById("service-details-number");
const serviceDetailsTitle = document.getElementById("service-details-title");
const serviceDetailsList = document.getElementById("service-details-list");

serviceCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const service = serviceDetails[card.dataset.service];

        serviceDetailsNumber.textContent = service.number;
        serviceDetailsTitle.textContent = service.title;

        serviceDetailsList.innerHTML = service.items
            .map(function (item) {
                return `<p>↳ ${item}</p>`;
            })
            .join("");

        serviceDetailsBox.classList.add("active");

    });

});

if (serviceDetailsClose && serviceDetailsBox) {
    serviceDetailsClose.addEventListener("click", function () {
        serviceDetailsBox.classList.remove("active");
    });

    serviceDetailsBox.addEventListener("click", function (event) {
        if (event.target === serviceDetailsBox) {
            serviceDetailsBox.classList.remove("active");
        }
    });
}

/* =====================================
   HWANWRITES TERMS POPUP BEHAVIOR
===================================== */

(() => {
    function initTermsPopup() {
        const dock = document.getElementById("terms-dock");
        const toggle = document.getElementById("terms-toggle");
        const panel = document.getElementById("terms-panel");
        const close = document.getElementById("terms-close");

        if (!dock || !toggle || !panel || !close) return;

        const openTerms = () => {
            dock.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
            panel.setAttribute("aria-hidden", "false");
        };

        const closeTerms = () => {
            dock.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            panel.setAttribute("aria-hidden", "true");
        };

        toggle.addEventListener("click", (event) => {
            event.stopPropagation();

            if (dock.classList.contains("is-open")) {
                closeTerms();
            } else {
                openTerms();
            }
        });

        close.addEventListener("click", (event) => {
            event.stopPropagation();
            closeTerms();
        });

        document.addEventListener("click", (event) => {
            if (!dock.contains(event.target)) closeTerms();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeTerms();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTermsPopup);
    } else {
        initTermsPopup();
    }
})();

/* STORY FLIP CARDS: ONE FLIPPED AT A TIME */
console.log("Flip card script is working!");

const galleryCards = document.querySelectorAll(".profile-gallery-card");

galleryCards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    function flipCard() {
        const isAlreadyFlipped = card.classList.contains("is-flipped");

        // Return all other cards to the front
        galleryCards.forEach((otherCard) => {
            otherCard.classList.remove("is-flipped");
            otherCard.setAttribute("aria-pressed", "false");
        });

        // Flip this card only if it was previously closed
        if (!isAlreadyFlipped) {
            card.classList.add("is-flipped");
            card.setAttribute("aria-pressed", "true");
        }
    }

    card.addEventListener("click", flipCard);

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            flipCard();
        }
    });
});

/* =========================================
   TRUST GALLERY PLACEHOLDER NAVIGATION
========================================= */

(() => {
    const galleryTotals = {
        transactions: 58,
        testimonials: 27
    };

    document.querySelectorAll(".trust-slider").forEach((slider) => {
        const galleryName = slider.dataset.gallery;
        const total = galleryTotals[galleryName];

        if (!total) return;

        const counter = slider.querySelector(".trust-counter");
        const buttons = slider.querySelectorAll(".trust-arrow");
        const placeholderTitle = slider.querySelector(
            ".trust-placeholder p"
        );

        if (!counter || !placeholderTitle || buttons.length === 0) {
            return;
        }

        let currentIndex = 0;
        let startX = 0;
        let startY = 0;

        function showSlide(index) {
            currentIndex = ((index % total) + total) % total;

            counter.textContent = `${currentIndex + 1} / ${total}`;

            if (galleryName === "transactions") {
                placeholderTitle.textContent =
                    `Transaction Proof ${currentIndex + 1}`;
            } else if (galleryName === "testimonials") {
                placeholderTitle.textContent =
                    `Client Feedback ${currentIndex + 1}`;
            }
        }

        // PREVIOUS AND NEXT BUTTONS
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const direction = Number(button.dataset.direction);

                if (direction !== -1 && direction !== 1) return;

                showSlide(currentIndex + direction);
            });
        });

        // SWIPE NAVIGATION FOR TOUCHSCREENS
        slider.addEventListener("touchstart", (event) => {
            if (event.touches.length !== 1) return;

            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        slider.addEventListener("touchend", (event) => {
            if (event.changedTouches.length !== 1) return;

            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;

            const differenceX = endX - startX;
            const differenceY = endY - startY;

            // Ignore short swipes and vertical scrolling
            if (
                Math.abs(differenceX) < 45 ||
                Math.abs(differenceX) <= Math.abs(differenceY)
            ) {
                return;
            }

            showSlide(currentIndex + (differenceX < 0 ? 1 : -1));
        }, { passive: true });

        // INITIALIZE GALLERY
        showSlide(0);
    });
})();