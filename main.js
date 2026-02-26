document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("sidebar-container");
    const previewGrid = document.getElementById("preview-grid");
    const currentPath = window.location.pathname;
    const layout = document.querySelector(".layout");
    const toggleBtn = document.getElementById("sidebarToggle");

    /* =========================
       JSON LADEN
    ========================== */

    const jsonScript = document.getElementById("projects-data");

if (jsonScript && container) {

    const data = JSON.parse(jsonScript.textContent);

    data.forEach(group => {

        const groupDiv = document.createElement("div");
        groupDiv.classList.add("sidebar-group");

        const mainLink = document.createElement("a");
        mainLink.href = group.url;
        mainLink.textContent = group.title;

        groupDiv.appendChild(mainLink);

        if (group.subprojects && group.subprojects.length > 0) {

            const subDiv = document.createElement("div");
            subDiv.classList.add("sidebar-sub");

            group.subprojects.forEach(sub => {

                const subLink = document.createElement("a");
                subLink.href = sub.url;
                subLink.textContent = sub.title;

                subDiv.appendChild(subLink);

                if (previewGrid && sub.thumbnail) {
                    createPreview(sub);
                }

            });

            groupDiv.appendChild(subDiv);

        } else {

            if (previewGrid && group.thumbnail) {
                createPreview(group);
            }
        }

        container.appendChild(groupDiv);
    });
}

    function createPreview(item) {

        const preview = document.createElement("a");
        preview.href = item.url;
        preview.classList.add("preview-item");

        const img = document.createElement("img");
        img.src = item.thumbnail;
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
       HEADER ACTIVE STATE
    ========================== */

    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(function(link) {

        if (
            (currentPath.includes("/projects") && link.href.includes("projects")) ||
            (currentPath.includes("/drawings") && link.href.includes("drawings")) ||
            (currentPath.includes("/archive") && link.href.includes("archive")) ||
            (currentPath.includes("/about") && link.href.includes("about"))
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