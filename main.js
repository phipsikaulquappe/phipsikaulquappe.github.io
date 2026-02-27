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

/* =========================
   SIDEBAR → PREVIEW HOVER LINK
========================== */

    const sidebarLinks = document.querySelectorAll('.sidebar a[data-project]');
    const previewItems = document.querySelectorAll('.preview-item[data-project]');

    sidebarLinks.forEach(link => {

        link.addEventListener('mouseover', () => {

            const target = link.dataset.project;

            previewItems.forEach(item => {
                if (item.dataset.project === target) {
                    item.classList.add('sidebar-hover');
                }
            });

        });

        link.addEventListener('mouseout', () => {

            previewItems.forEach(item => {
                item.classList.remove('sidebar-hover');
            });

        });

    });
});