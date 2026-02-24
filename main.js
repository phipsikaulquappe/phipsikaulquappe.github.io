document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("sidebar-container");
    const currentPath = window.location.pathname;

    /* =========================
       SIDEBAR LADEN
    ========================== */

    if (container) {

        let sidebarFile = null;

        if (currentPath.startsWith("/projects")) {
            sidebarFile = "projects-list.html";
        } 
        else if (currentPath.startsWith("/drawings")) {
            sidebarFile = "drawings-list.html";
        } 
        else if (currentPath.startsWith("/archive")) {
            sidebarFile = "archive-list.html";
        } 
        else if (currentPath.startsWith("/about")) {
            sidebarFile = "about-list.html";
        }

        /* Fallback für Startseite */
        if (!sidebarFile && (currentPath === "/" || currentPath === "/index.html")) {
            sidebarFile = "projects-list.html"; 
            // oder null, wenn Index keine Sidebar haben soll
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

                        const mainLink = group.querySelector("a");
                        const firstSub = sub.querySelector("a");

                        if (!mainLink || !firstSub) return;

                        mainLink.addEventListener("click", function(e) {

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

        if (currentPath.startsWith(href.replace(".html", ""))) {
            link.classList.add("active");
        }

    });

    /* =========================
       MOBILE SIDEBAR TOGGLE
    ========================== */

    const toggleBtn = document.getElementById("sidebarToggle");
    const layout = document.querySelector(".layout");

    if (toggleBtn && layout) {
        toggleBtn.addEventListener("click", function () {
            layout.classList.toggle("sidebar-open");
        });
    }

});