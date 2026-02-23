document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SIDEBAR AUTOMATISCH LADEN
    ========================== */

    const container = document.getElementById("sidebar-container");
    const path = window.location.pathname;

    if (container) {

        let sidebarFile = null;

        if (path.includes("projects")) {
            sidebarFile = "projects-list.html";
        } else if (path.includes("drawings")) {
            sidebarFile = "drawings-list.html";
        } else if (path.includes("archive")) {
            sidebarFile = "archive-list.html";
        } else if (path.includes("about")) {
            sidebarFile = "about-list.html";
        }

        if (sidebarFile) {

            fetch(sidebarFile)
                .then(response => response.text())
                .then(data => {

                    container.innerHTML = data;

                    const currentPath = window.location.pathname;
                    const links = container.querySelectorAll("a");

                    /* =========================
                       SIDEBAR ACTIVE LINK
                    ========================== */

                    links.forEach(link => {
                        const linkPath = new URL(link.href).pathname;

                        if (linkPath === currentPath) {
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

                        if (sub) {

                            const mainLink = group.querySelector("a");
                            const firstSub = sub.querySelector("a");

                            if (mainLink && firstSub) {

                                mainLink.addEventListener("click", function (e) {

                                    // Nur umleiten wenn nicht direkt ein Sublink geklickt wurde
                                    if (!e.target.closest(".sidebar-sub")) {
                                        e.preventDefault();
                                        window.location.href = firstSub.href;
                                    }

                                });

                            }
                        }

                    });

                })
                .catch(error => {
                    console.error("Sidebar konnte nicht geladen werden:", error);
                });
        }
    }

    /* =========================
       HEADER ACTIVE STATE
    ========================== */

    const currentPathNav =
        window.location.pathname === "/"
            ? "/index.html"
            : window.location.pathname;

    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(link => {

        const linkPath = new URL(link.href).pathname;

        if (
            currentPathNav === linkPath ||
            currentPathNav.startsWith(linkPath.replace(".html", "/"))
        ) {
            link.classList.add("active");
        }

    });

});