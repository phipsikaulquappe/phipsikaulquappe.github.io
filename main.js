fetch("/sidebar-list.html")
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById("sidebar-container");
        if (!container) return;

        container.innerHTML = data;

        const currentPath = window.location.pathname;

        // --- Projektliste aktiv markieren ---
        const links = container.querySelectorAll("a");

        links.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath) {
                link.classList.add("active");

                const group = link.closest(".sidebar-group");
                if (group) group.classList.add("open");
            }
        });

        // --- Hauptprojekt → erstes Subprojekt ---
        const groups = container.querySelectorAll(".sidebar-group");

        groups.forEach(group => {
            const sub = group.querySelector(".sidebar-sub");

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

const currentPathNav = window.location.pathname === "/" 
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