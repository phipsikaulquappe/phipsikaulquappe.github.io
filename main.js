document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("sidebar-container");
    const currentPath = window.location.pathname;
    const layout = document.querySelector(".layout");
    const toggleBtn = document.getElementById("sidebarToggle");

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

                    /* =========================
                       Thumbnail PREVIEW GRID
                    ========================== */

                    const previewGrid = document.getElementById("preview-grid");

                    if (previewGrid) {

                        const parser = new DOMParser();
                        const sidebarDoc = parser.parseFromString(data, "text/html");

                        let selector = null;

                        if (currentPath.includes("/projects")) {
                            selector = 'a[href*="/projects/"]';
                        } else if (currentPath.includes("/drawings")) {
                            selector = 'a[href*="/drawings/"]';
                        } else if (currentPath.includes("/archive")) {
                            selector = 'a[href*="/archive/"]';
                        } else if (currentPath.includes("/about")) {
                            selector = 'a[href*="/about/"]';
                        }

                        if (!selector) return;

                        const subLinks = sidebarDoc.querySelectorAll(selector);
                        subLinks.forEach(link => {

                            const url = link.getAttribute("href");
                            if (!url) return;

                            // Platzhalter sofort erzeugen (Reihenfolge bleibt korrekt)
                            const item = document.createElement("a");
                            item.href = url;
                            item.classList.add("preview-item");

                            previewGrid.appendChild(item);

                            fetch(url)
                                .then(res => res.text())
                                .then(html => {

                                    const subDoc = parser.parseFromString(html, "text/html");
                                    const firstImage = subDoc.querySelector(".media-grid img");
                                    if (!firstImage) return;

                                    const img = document.createElement("img");
                                    img.src = firstImage.getAttribute("src");

                                    const title = document.createElement("div");
                                    title.classList.add("preview-title");
                                    title.textContent = link.textContent.trim();

                                    item.appendChild(img);
                                    item.appendChild(title);

                                })
                                .catch(err => console.log("Preview Fehler:", err));

                        });

                    }

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

        const sidebar = document.querySelector(".sidebar");

        if (toggleBtn && toggleBtn.contains(e.target)) return;
        if (sidebar && sidebar.contains(e.target)) return;

        e.preventDefault();
        e.stopPropagation();

        layout.classList.remove("sidebar-open");

    });

    /* =========================
       BACKGROUND TOGGLE
    ========================== */

    const themeBtn = document.getElementById("themeToggle");

    if (themeBtn) {

        const themes = ["theme-red", "theme-gray", "theme-yellow"];

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

            if (currentIndex !== -1) {
                document.body.classList.remove(themes[currentIndex]);
            }

            let nextIndex = (currentIndex + 1) % themes.length;
            document.body.classList.add(themes[nextIndex]);

            localStorage.setItem("siteTheme", themes[nextIndex]);

        });
    }

});