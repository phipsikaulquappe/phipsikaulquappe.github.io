fetch("/projects-list.html")
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById("projects-list-container");
        if (!container) return;

        container.innerHTML = data;

        const currentPath = window.location.pathname;

        const links = container.querySelectorAll("a");

        links.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath) {
                link.classList.add("active");

                // Falls es ein Subprojekt ist, öffne automatisch die Gruppe
                const group = link.closest(".project-group");
                if (group) {
                    group.classList.add("open");
                }
            }
        });

        const groups = container.querySelectorAll(".project-group");

        groups.forEach(group => {
            const sub = group.querySelector(".subprojects");
            if (sub) {
                const mainLink = group.querySelector("a");

                mainLink.addEventListener("click", function(e) {
                    e.preventDefault();
                    group.classList.toggle("open");
                });
            }
        });
    });