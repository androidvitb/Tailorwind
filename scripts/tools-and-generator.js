document.addEventListener("DOMContentLoaded", () => {
    const gridViewButton = document.querySelector("#grid-view");
    const listViewButton = document.querySelector("#list-view");
    const cardContainer = document.querySelector("#card-container");
    const cardButtons = document.querySelectorAll(".card-button");
    const cardContents = document.querySelectorAll(".card-content");

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