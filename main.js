document.addEventListener("DOMContentLoaded", function () {

    const layout = document.querySelector(".layout");
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.querySelector(".sidebar");

    /* =========================
       SIDEBAR TOGGLE MOBILE
    ========================== */

    if (toggleBtn && layout) {
        toggleBtn.addEventListener("click", function () {
            layout.classList.toggle("sidebar-open");
        });
    }

    /* =========================
       SIDEBAR CLOSE ON OUTSIDE CLICK
    ========================== */

    document.addEventListener("click", function (e) {

        if (!layout || !layout.classList.contains("sidebar-open")) return;

        if (toggleBtn && toggleBtn.contains(e.target)) return;
        if (sidebar && sidebar.contains(e.target)) return;

        layout.classList.remove("sidebar-open");

    });

    /* =========================
       THEME TOGGLE
    ========================== */

    const themeBtn = document.getElementById("themeToggle");

    if (themeBtn) {

        const themes = ["theme-red", "theme-gray", "theme-yellow"];
        const savedTheme = localStorage.getItem("siteTheme");

        document.body.classList.add(savedTheme || "theme-red");

        themeBtn.addEventListener("click", function () {

            let currentIndex = themes.findIndex(t =>
                document.body.classList.contains(t)
            );

            if (currentIndex !== -1) {
                document.body.classList.remove(themes[currentIndex]);
            }

            let nextIndex = (currentIndex + 1) % themes.length;
            document.body.classList.add(themes[nextIndex]);
            localStorage.setItem("siteTheme", themes[nextIndex]);

        });
    }

     /* =========================
       SIDEBAR → PREVIEW HOVER LINK
    ========================== */

    const sidebarLinks = document.querySelectorAll('.sidebar a[data-project]');

    sidebarLinks.forEach(link => {

        link.addEventListener('mouseenter', () => {
            const target = link.dataset.project;

            document.querySelectorAll('.preview-item').forEach(item => {
                item.classList.remove('sidebar-hover');

                if (item.dataset.project === target) {
                    item.classList.add('sidebar-hover');
                }
            });
        });

    });

    document.querySelector('.sidebar').addEventListener('mouseleave', () => {
        document.querySelectorAll('.preview-item')
            .forEach(item => item.classList.remove('sidebar-hover'));
    });
    

    /* =========================
    LIGHTBOX (EDITORIAL MODE)
    ========================== */

    const images = document.querySelectorAll('.media-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const btnPrev = document.getElementById('slideshowNavLeft');
    const btnNext = document.getElementById('slideshowNavRight');
    const btnClose = document.getElementById('slideshowClose');

    let currentIndex = 0;

    if (images.length) {

        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            lightbox.classList.remove('hidden');
            updateImage();
        }

        function closeLightbox() {
            lightbox.classList.add('hidden');
        }

        function updateImage() {
            lightboxImage.src = images[currentIndex].src;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        }

        btnNext.addEventListener('click', showNext);
        btnPrev.addEventListener('click', showPrev);
        btnClose.addEventListener('click', closeLightbox);
        
        // Klick-Zonen links / rechts
        lightbox.addEventListener('click', (e) => {

            if (e.target === btnClose) return;

            const clickX = e.clientX;
            const screenWidth = window.innerWidth;

            if (clickX > screenWidth / 2) {
                showNext();
            } else {
                showPrev();
            }

            if (lightbox.classList.contains('hidden')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            }

        });

    }
    
});