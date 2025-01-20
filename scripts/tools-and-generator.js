document.addEventListener("DOMContentLoaded", () => {
    const gridViewButton = document.querySelector("#grid-view");
    const listViewButton = document.querySelector("#list-view");
    const cardContainer = document.querySelector("#card-container");
    const cardButtons = document.querySelectorAll(".card-button");
    const cardContents = document.querySelectorAll(".card-content");

    // Check and apply initial dark mode state
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
    }

    // Update view buttons for dark mode
    function updateViewButtonsStyle() {
        const isDark = document.documentElement.classList.contains('dark');
        [gridViewButton, listViewButton].forEach(button => {
            if (isDark) {
                button.classList.add('dark:bg-gray-700', 'dark:text-white', 'dark:hover:bg-gray-600');
                button.classList.remove('bg-gray-200', 'hover:bg-gray-300');
            } else {
                button.classList.remove('dark:bg-gray-700', 'dark:text-white', 'dark:hover:bg-gray-600');
                button.classList.add('bg-gray-200', 'hover:bg-gray-300');
            }
        });
    }

    // Initial style update
    updateViewButtonsStyle();

    // Listen for dark mode changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateViewButtonsStyle();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Existing view toggle functionality
    gridViewButton.addEventListener("click", () => {
        cardContainer.classList.remove("list-view");
        cardContainer.classList.add(
            "grid",
            "grid-cols-1",
            "md:grid-cols-3",
            "gap-8"
        );

        cardButtons.forEach((button) => {
            button.classList.remove("w-40", "text-center");
            button.classList.add("w-full", "text-left");
        });

        cardContents.forEach((content) => {
            content.classList.add("flex-col");
        });
    });

    listViewButton.addEventListener("click", () => {
        cardContainer.classList.remove(
            "grid",
            "grid-cols-1",
            "md:grid-cols-3",
            "gap-8"
        );
        cardContainer.classList.add("list-view");

        cardButtons.forEach((button) => {
            button.classList.remove("w-full", "text-left");
            button.classList.add("w-40", "text-center");
        });

        cardContents.forEach((content) => {
            content.classList.remove("flex-col");
        });
    });
});