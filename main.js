document.addEventListener("DOMContentLoaded", function () {

    const currentPath = window.location.pathname;
    const layout = document.querySelector(".layout");
    const toggleBtn = document.getElementById("sidebarToggle");

    /* =========================
       SIDEBAR ACTIVE STATE
    ========================== */

    const sidebarLinks = document.querySelectorAll(".sidebar a");

    sidebarLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");

            const group = link.closest(".sidebar-group");
            if (group) group.classList.add("open");
        }
    });

    /* =========================
       HEADER ACTIVE STATE
    ========================== */

    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(link => {
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

    /* =========================
       SIDEBAR CLOSE ON OUTSIDE CLICK
    ========================== */

    document.addEventListener("click", function (e) {

        if (!layout.classList.contains("sidebar-open")) return;

        const sidebar = document.querySelector(".sidebar");

        if (toggleBtn.contains(e.target)) return;
        if (sidebar.contains(e.target)) return;

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