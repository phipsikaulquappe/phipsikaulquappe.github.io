fetch("/projects-list.html")
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById("projects-list-container");
        if (!container) return;

        container.innerHTML = data;

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