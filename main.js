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

        toggleBtn.addEventListener("click", function () {
            layout.classList.toggle("sidebar-open");
        });

    }

    /* =========================
    SIDEBAR CLOSE ON OUTSIDE CLICK
    ========================= */

    document.addEventListener("click", function (e) {

        if (!layout.classList.contains("sidebar-open")) return;

        const sidebar = document.querySelector(".sidebar");

        // Klick auf Toggle → normal weiter
        if (toggleBtn.contains(e.target)) return;

        // Klick in Sidebar → normal weiter
        if (sidebar.contains(e.target)) return;

        // Alles andere:
        e.preventDefault();      // verhindert Link-Klick
        e.stopPropagation();     // stoppt weitere Events

        layout.classList.remove("sidebar-open");
        document.body.classList.remove("no-scroll");

    });

        /* =========================
        BACKGROUND TOGGLE-SWITCH
        ========================= */

    const themeBtn = document.getElementById("themeToggle");

    if (themeBtn) {

        const themes = ["theme-red", "theme-gray", "theme-yellow"];

        // gespeichertes Theme laden
        const savedTheme = localStorage.getItem("siteTheme");
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        } else {
            document.body.classList.add("theme-red");
        }

        themeBtn.addEventListener("click", function () {

            let currentIndex = themes.findIndex(t => 
                document.body.classList.contains(t)
            );

            // aktuelles Theme entfernen
            if (currentIndex !== -1) {
                document.body.classList.remove(themes[currentIndex]);
            }

            // nächstes Theme wählen
            let nextIndex = (currentIndex + 1) % themes.length;
            document.body.classList.add(themes[nextIndex]);

            // speichern
            localStorage.setItem("siteTheme", themes[nextIndex]);
        });
    }

});