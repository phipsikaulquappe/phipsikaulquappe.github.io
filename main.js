document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("sidebar-container");
    const currentPath = window.location.pathname;

    /* =========================
       SIDEBAR LADEN
    ========================== */

    if (container) {

        let sidebarFile = null;

        if (currentPath.includes("/projects")) {
            sidebarFile = "projects-list.html";
        } else if (currentPath.includes("/drawings")) {
            sidebarFile = "drawings-list.html";
        } else if (currentPath.includes("/archive")) {
            sidebarFile = "archive-list.html";
        } else if (currentPath.includes("/about")) {
            sidebarFile = "about-list.html";
        }

        if (sidebarFile) {

            fetch("/" + sidebarFile)
                .then(response => response.text())
                .then(data => {

                    container.innerHTML = data;

                    const links = container.querySelectorAll("a");

                    /* =========================
                       SIDEBAR ACTIVE LINK
                    ========================== */

                    links.forEach(function(link) {

                        const href = link.getAttribute("href");
                        if (!href) return;

                        if (href === currentPath) {
                            link.classList.add("active");

                            const group = link.closest(".sidebar-group");
                            if (group) group.classList.add("open");
                        }

                    });

                    /* =========================
                       HAUPTLINK → ERSTES SUB
                    ========================== */

                    const groups = container.querySelectorAll(".sidebar-group");

                    groups.forEach(function(group) {

                        const sub = group.querySelector(".sidebar-sub");
                        if (!sub) return;

                        const mainLink = group.querySelector("a"); // KEIN :scope
                        const firstSub = sub.querySelector("a");

                        if (!mainLink || !firstSub) return;

                        mainLink.addEventListener("click", function(e) {

                            // nur wenn nicht direkt ein sublink geklickt wurde
                            if (!e.target.closest(".sidebar-sub")) {
                                e.preventDefault();
                                window.location.href = firstSub.href;
                            }

                        });

                    });

                })
                .catch(function(err) {
                    console.error("Sidebar Fehler:", err);
                });

        }
    }

    /* =========================
       HEADER ACTIVE STATE
    ========================== */

    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(function(link) {

        const href = link.getAttribute("href");
        if (!href) return;

        if (
            (currentPath.includes("/projects") && href.includes("projects")) ||
            (currentPath.includes("/drawings") && href.includes("drawings")) ||
            (currentPath.includes("/archive") && href.includes("archive")) ||
            (currentPath.includes("/about") && href.includes("about"))
        ) {
            link.classList.add("active");
        }

    });
        /* =========================
        SIDEBAR TOGGLE MOBILE
        ========================= */

    const toggleBtn = document.getElementById("sidebarToggle");
    const layout = document.querySelector(".layout");

    if (toggleBtn && layout) {

        toggleBtn.addEventListener("click", function (e) {
            e.stopPropagation();

            layout.classList.toggle("sidebar-open");
            toggleBtn.classList.toggle("active");
        });

        // Klick außerhalb schließt Sidebar
        document.addEventListener("click", function (e) {

            if (!layout.contains(e.target)) {
                layout.classList.remove("sidebar-open");
                toggleBtn.classList.remove("active");
            }

        });

    }
});