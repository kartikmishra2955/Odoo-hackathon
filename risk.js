console.log("Risk Module Loaded Successfully");

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        const title = card.querySelector("h3").innerText;

        alert(`${title} analytics opened successfully.`);
    });
});