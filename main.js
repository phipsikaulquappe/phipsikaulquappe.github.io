document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("sidebar-container");
    const currentPath = window.location.pathname;

    /* =========================
       SIDEBAR LADEN
    ========================== */

    if (container) {

        let sidebarFile = null;

        if (currentPath.includes("projects")) {
            sidebarFile = "projects-list.html";
        } else if (currentPath.includes("drawings")) {
            sidebarFile = "drawings-list.html";
        } else if (currentPath.includes("archive")) {
            sidebarFile = "archive-list.html";
        } else if (currentPath.includes("about")) {
            sidebarFile = "about-list.html";
        }

        if (sidebarFile) {

            fetch(sidebarFile)
                .then(response => response.text())
                .then(data => {

                    container.innerHTML = data;

                    const links = container.querySelectorAll("a");

                    /* =========================
                       SIDEBAR ACTIVE LINK
                    ========================== */

                    links.forEach(link => {

                        const href = link.getAttribute("href");

                        if (!href) return;

                        if (currentPath.endsWith(href)) {
                            link.classList.add("active");

                            const group = link.closest(".sidebar-group");
                            if (group) group.classList.add("open");
                        }

                    });

                    /* =========================
                       HAUPTLINK → ERSTES SUB
                    ========================== */

                    const groups = container.querySelectorAll(".sidebar-group");

                    groups.forEach(group => {

                        const sub = group.querySelector(".sidebar-sub");

                        if (!sub) return;

                        const mainLink = group.querySelector("a");
                        const firstSub = sub.querySelector("a");

                        if (!mainLink || !firstSub) return;

                        mainLink.addEventListener("click", function (e) {

                            if (!e.target.closest(".sidebar-sub")) {
                                e.preventDefault();
                                window.location.href = firstSub.getAttribute("href");
                            }

                        });

                    });

                })
                .catch(err => {
                    console.error("Sidebar Fehler:", err);
                });
        }
    }

    /* =========================
       HEADER ACTIVE STATE
    ========================== */

    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        if (currentPath.endsWith(href)) {
            link.classList.add("active");
        }

    });

});