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
   TWO INDEPENDENT CERTIFICATE CAROUSELS
   ========================================= */

(() => {
    const imageViewer = document.getElementById("image-viewer");
    const viewerImage = document.getElementById("viewer-image");
    const viewerPrev = document.getElementById("certificate-viewer-prev");
    const viewerNext = document.getElementById("certificate-viewer-next");
    const viewerCounter = document.getElementById("certificate-viewer-counter");

    if (!imageViewer || !viewerImage) {
        console.error("Certificate viewer HTML is missing.");
        return;
    }

    let activeGallery = null;
    let viewerIndex = 0;

    function closeImage() {
        imageViewer.classList.remove("active");
        activeGallery = null;
    }

    function updateViewer() {
        if (!activeGallery) return;

        const slide = activeGallery.slides[viewerIndex];
        const image = slide?.querySelector("img");
        if (!image) return;

        viewerImage.src = image.src;
        viewerImage.alt = image.alt || "Certificate preview";

        if (viewerCounter) {
            viewerCounter.textContent =
                `${viewerIndex + 1} / ${activeGallery.slides.length}`;
        }
    }

    function moveViewer(direction) {
        if (!activeGallery || !activeGallery.slides.length) return;

        const total = activeGallery.slides.length;
        viewerIndex = (viewerIndex + direction + total) % total;

        activeGallery.show(viewerIndex);
        updateViewer();
    }

    function createCertificateGallery(carouselId, prevId, nextId, counterId) {
        const carousel = document.getElementById(carouselId);
        const prev = document.getElementById(prevId);
        const next = document.getElementById(nextId);
        const counter = document.getElementById(counterId);

        if (!carousel) {
            console.error(`Certificate carousel not found: ${carouselId}`);
            return null;
        }

        const slides = Array.from(
            carousel.querySelectorAll(".certificate-slide")
        );

        if (!slides.length) {
            console.error(`No certificate slides found in ${carouselId}`);
            return null;
        }

        let current = 0;
        let touchStartX = 0;

        function show(index) {
            current = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === current);
            });

            if (counter) {
                counter.textContent = `${current + 1} / ${slides.length}`;
            }
        }

        const gallery = {
            slides,
            show,
            get current() {
                return current;
            }
        };

        function openViewer(index) {
            show(index);
            activeGallery = gallery;
            viewerIndex = current;

            updateViewer();
            imageViewer.classList.add("active");
        }

        slides.forEach((slide, index) => {
            const image = slide.querySelector("img");
            if (!image) return;

            image.style.cursor = "zoom-in";
            image.setAttribute("tabindex", "0");
            image.setAttribute("role", "button");
            image.setAttribute(
                "aria-label",
                `View certificate ${index + 1} of ${slides.length} in full size`
            );

            image.addEventListener("click", () => {
                openViewer(index);
            });

            image.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openViewer(index);
                }
            });
        });

        prev?.addEventListener("click", () => show(current - 1));
        next?.addEventListener("click", () => show(current + 1));

        carousel.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener("touchend", event => {
            const distance =
                event.changedTouches[0].screenX - touchStartX;

            if (Math.abs(distance) < 40) return;

            show(distance < 0 ? current + 1 : current - 1);
        }, { passive: true });

        show(0);
        return gallery;
    }

    viewerPrev?.addEventListener("click", event => {
        event.stopPropagation();
        moveViewer(-1);
    });

    viewerNext?.addEventListener("click", event => {
        event.stopPropagation();
        moveViewer(1);
    });

    imageViewer.addEventListener("click", event => {
        if (event.target === imageViewer) closeImage();
    });

    imageViewer.querySelector(".image-viewer-close")
        ?.addEventListener("click", event => {
            event.stopPropagation();
            closeImage();
        });

    let viewerTouchStartX = 0;

    imageViewer.addEventListener("touchstart", event => {
        viewerTouchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    imageViewer.addEventListener("touchend", event => {
        if (!imageViewer.classList.contains("active")) return;

        const distance =
            event.changedTouches[0].screenX - viewerTouchStartX;

        if (Math.abs(distance) < 40) return;

        moveViewer(distance < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener("keydown", event => {
        if (!imageViewer.classList.contains("active")) return;

        if (event.key === "Escape") closeImage();
        if (event.key === "ArrowRight") moveViewer(1);
        if (event.key === "ArrowLeft") moveViewer(-1);
    });

    createCertificateGallery(
        "freelancing-carousel",
        "freelancing-prev",
        "freelancing-next",
        "freelancing-counter"
    );

    createCertificateGallery(
        "other-certificates-carousel",
        "other-prev",
        "other-next",
        "other-counter"
    );
})();

/* =========================================
   INTERACTIVE SERVICE DETAILS
   ========================================= */

const serviceDetails = {
    research: {
        number: "01",
        title: "Research Assistance",
        items: [
            "Complete Research Paper",
            "Chapter 1-5 Only",
            "Per-Chapter",
            "Per-Parts",
            "Questionnaire Construction",
            "Research Abstract",
            "Research Gap",
            "Bibliography",
            "Appendices",
            "Table of Contents",
            "Curriculum Vitae",
            "Research Title Proposal",
            "Research Proposal",
            "Data Encoding",
            "Data Cleaning",
            "Statistical Analysis",
            "Thematic Analysis",
            "IMRaD Assistance",
            "Oral Defense PPT",
            "APA 7 Formatting",
            "Reference Checking",
            "Citation Formatting",
            "Grammar Checking",
            "Proofreading",
            "Manual Paraphrasing",
            "Manual AI Content Revision",
            "Turnitin Scan (AI & Plagiarism)",
            "Paper Consultation"
        ]
    },

    academic: {
        number: "02",
        title: "Academic Services",
        items: [
            "Essay",
            "Reflection Paper",
            "Reaction Paper",
            "Position Paper (citations and references included)",
            "Critique Paper",
            "Case Study",
            "Academic Reports (Narrative/Accomplishment/etc.)",
            "Complete Feasibility Study Assistance",
            "Senior High School Research",
            "OJT Journal",
            "Daily Journal Entry",
            "Weekly Journal Entry",
            "Business Plan",
            "Event Plan",
            "Concept Paper",
            "Presentation Slides"
        ]
    },

    documents: {
        number: "03",
        title: "Professional Documents",
        items: [
            "Resume/CV (ATS-Friendly, with application/cover letter)",
            "Letter of Intent",
            "Letter of Request",
            "Recommendation Letter (Drafting)",
            "Personal Statement",
            "Statement of Purpose (SOP)",
            "Business Letters",
            "Formal Letters",
            "Invitation Letters/Content",
            "Authorization Letter",
            "Memorandum of Agreement (Drafting)",
            "Certificates Content"
        ]
    },

    web: {
        number: "04",
        title: "Web Development",
        items: [
            "System Development (PHP/MySQL)",
            "Laravel Development",
            "Front-End Development (HTML, CSS, JavaScript)",
            "Database Design",
            "System Integration",
            "Deployment Guide",
            "Maintenance Guide",
            "Bug Fixing Support",
            "System Documentation",
            "System Requirements Specification (SRS)",
            "System Design (DFD, ERD, UML)",
            "User Interface Design",
            "User Manual",
            "Testing Documentation",
            "Implementation Guide",
            "Editing & Formatting"
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
   TRUSTED TRANSACTION & CLIENT FEEDBACK
========================================= */

(() => {
    const galleryConfig = {
        transactions: {
            total: 59,
            frontPage: "TrustedTransactionFrontPage.jpg",
            imageName: (number) => `${number}Transaction.jpg`,
            alt: (number) =>
                number === 0
                    ? "Trusted Transaction front page"
                    : `Trusted Transaction ${number}`
        },

        testimonials: {
            total: 27,
            frontPage: "ClientFeedbackFrontPage.jpg",

            imageName: (number) => {
                // Skip the missing 5Feedback.jpg
                const actualNumber = number >= 5
                    ? number + 1
                    : number;

                return `${actualNumber}Feedback.jpg`;
            },

            alt: (number) => {
                if (number === 0) {
                    return "Client Feedback front page";
                }

                const actualNumber = number >= 5
                    ? number + 1
                    : number;

                return `Client Feedback ${actualNumber}`;
            }
        }
    };

    document.querySelectorAll(".trust-slider").forEach((slider) => {
        const galleryName = slider.dataset.gallery;
        const config = galleryConfig[galleryName];

        if (!config) return;

        const frame = slider.querySelector(".trust-image-frame");
        const counter = slider.querySelector(".trust-counter");
        const buttons = slider.querySelectorAll(".trust-arrow");

        if (!frame || !counter || buttons.length === 0) return;

        const image = document.createElement("img");
        image.className = "trust-gallery-image";
        image.loading = "lazy";
        image.decoding = "async";

        frame.querySelector(".trust-placeholder")?.remove();
        frame.prepend(image);

        let currentIndex = 0;
        let startX = 0;
        let startY = 0;

        function showSlide(index) {
            currentIndex =
                (index + config.total) % config.total;

            const filename = currentIndex === 0
                ? config.frontPage
                : config.imageName(currentIndex);

            image.src = `images/${filename}`;
            image.alt = config.alt(currentIndex);

            counter.textContent =
                `${currentIndex + 1} / ${config.total}`;
        }

        // PREVIOUS AND NEXT BUTTONS
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const direction = Number(button.dataset.direction);

                if (direction === -1 || direction === 1) {
                    showSlide(currentIndex + direction);
                }
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

            if (
                Math.abs(differenceX) < 45 ||
                Math.abs(differenceX) <= Math.abs(differenceY)
            ) {
                return;
            }

            showSlide(currentIndex + (differenceX < 0 ? 1 : -1));
        }, { passive: true });

        // REPORT MISSING IMAGES
        image.addEventListener("error", () => {
            console.error(`Gallery image not found: ${image.src}`);
        });

        // INITIALIZE GALLERY
        showSlide(0);
    });
})();