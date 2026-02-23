fetch("/projects-list.html")
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById("projects-list-container");
        if (!container) return;

        container.innerHTML = data;

        const currentPath = window.location.pathname;

        // --- Projektliste aktiv markieren ---
        const links = container.querySelectorAll("a");

        links.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath) {
                link.classList.add("active");

                const group = link.closest(".project-group");
                if (group) group.classList.add("open");
            }
        });

        // --- Hauptprojekt → erstes Subprojekt ---
        const groups = container.querySelectorAll(".project-group");

        groups.forEach(group => {
            const sub = group.querySelector(".subprojects");

            if (sub) {
                const mainLink = group.querySelector("a");
                const firstSub = sub.querySelector("a");

                mainLink.addEventListener("click", function(e) {
                    e.preventDefault();
                    if (firstSub) {
                        window.location.href = firstSub.href;
                    }
                });
            }
        });
    });


// --- Navigation aktiv markieren ---

document.addEventListener("DOMContentLoaded", function () {

    let currentPath = window.location.pathname;

    // Falls Startseite "/" ist → als "/index.html" behandeln
    if (currentPath === "/") {
        currentPath = "/index.html";
    }

    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;

        // Exakte Übereinstimmung
        if (currentPath === linkPath) {
            link.classList.add("active");
        }

        // Wenn man sich in einem Unterordner befindet
        else if (
            currentPath.startsWith(linkPath.replace(".html", "/"))
        ) {
            link.classList.add("active");
        }
    });

});