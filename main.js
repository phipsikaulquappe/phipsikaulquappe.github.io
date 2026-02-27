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
            console.log("Sidebar Hover:", link.dataset.project);

            const preview = document.querySelector(
                '.preview-item[data-project="' + link.dataset.project + '"]'
            );

            console.log("Found preview:", preview);

            if (preview) {
                preview.classList.add('sidebar-hover');
            }
        });

    });
});