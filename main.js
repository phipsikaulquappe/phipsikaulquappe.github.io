document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("sidebar-container");
    const previewGrid = document.getElementById("preview-grid");
    const gallery = document.getElementById("project-gallery");
    const currentPath = window.location.pathname;
    const layout = document.querySelector(".layout");
    const toggleBtn = document.getElementById("sidebarToggle");

    /* =========================
       LOAD JSON DATA
    ========================== */

    fetch("/data/projects.json")
        .then(res => res.json())
        .then(data => init(data))
        .catch(err => console.error("JSON Fehler:", err));

    function init(data) {

        data.forEach(group => {

            const groupDiv = document.createElement("div");
            groupDiv.classList.add("sidebar-group");

            const mainLink = document.createElement("a");
            mainLink.href = group.url;
            mainLink.textContent = group.title;

            if (group.url === currentPath) {
                mainLink.classList.add("active");
                groupDiv.classList.add("open");
            }

            groupDiv.appendChild(mainLink);

            /* =========================
               SUBPROJECTS
            ========================== */

            if (group.subprojects && group.subprojects.length > 0) {

                const subDiv = document.createElement("div");
                subDiv.classList.add("sidebar-sub");

                group.subprojects.forEach(sub => {

                    const subLink = document.createElement("a");
                    subLink.href = sub.url;
                    subLink.textContent = sub.title;

                    if (sub.url === currentPath) {
                        subLink.classList.add("active");
                        groupDiv.classList.add("open");
                    }

                    subDiv.appendChild(subLink);

                    /* PREVIEW */
                    if (previewGrid && sub.images?.length > 0) {
                        createPreview(sub);
                    }

                    /* PROJECT PAGE */
                    if (gallery && sub.url === currentPath) {
                        renderGallery(sub.images);
                    }

                });

                groupDiv.appendChild(subDiv);

                /* Hauptlink → erstes Sub */
                mainLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    window.location.href = group.subprojects[0].url;
                });

            } else {

                if (previewGrid && group.images?.length > 0) {
                    createPreview(group);
                }

                if (gallery && group.url === currentPath) {
                    renderGallery(group.images);
                }
            }

            if (container) container.appendChild(groupDiv);
        });
    }

    /* =========================
       PREVIEW
    ========================== */

    function createPreview(item) {

        const preview = document.createElement("a");
        preview.href = item.url;
        preview.classList.add("preview-item");

        const img = document.createElement("img");
        img.src = item.images[0];
        img.loading = "lazy";
        img.decoding = "async";

        const title = document.createElement("div");
        title.classList.add("preview-title");
        title.textContent = item.title;

        preview.appendChild(img);
        preview.appendChild(title);

        previewGrid.appendChild(preview);
    }

    /* =========================
       GALLERY (SMART LOADING)
    ========================== */

    function renderGallery(images) {

        images.forEach((path, index) => {

            const img = document.createElement("img");

            if (index === 0) {
                img.src = path;
                img.loading = "eager";
                img.decoding = "async";
            } else {
                img.dataset.src = path;
                img.classList.add("lazy-image");
            }

            gallery.appendChild(img);
        });

        initLazyLoading();
    }

    function initLazyLoading() {

        const lazyImages = document.querySelectorAll(".lazy-image");

        if (!("IntersectionObserver" in window)) {
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy-image");
                    obs.unobserve(img);
                }
            });

        }, {
            rootMargin: "200px"
        });

        lazyImages.forEach(img => observer.observe(img));
    }

    /* =========================
       HEADER ACTIVE STATE
    ========================== */

    document.querySelectorAll(".nav-right a").forEach(link => {

        if (currentPath.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        }
    });

    /* =========================
       SIDEBAR TOGGLE MOBILE
    ========================== */

    if (toggleBtn && layout) {
        toggleBtn.addEventListener("click", function () {
            layout.classList.toggle("sidebar-open");
        });
    }

    document.addEventListener("click", function (e) {

        if (!layout || !layout.classList.contains("sidebar-open")) return;

        const sidebar = document.querySelector(".sidebar");

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

});