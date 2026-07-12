console.log("Maintenance Module Loaded");

// =========================
// Load Maintenance Data
// =========================
async function loadMaintenance() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/maintenance"
        );

        const data = await response.json();

        console.log("Maintenance Data:", data);

    } catch (error) {
        console.error(error);
    }
}

// =========================
// Create Request
// =========================
document.querySelector(".create-btn")
?.addEventListener("click", async () => {

    const response = await fetch(
        "http://localhost:5000/api/maintenance",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                assetId: "ASSET-101",
                issueDescription: "Laptop overheating issue",
                priority: "HIGH"
            })
        }
    );

    const data = await response.json();

    alert(data.message);
});

// =========================
// Approve Buttons
// =========================
document.querySelectorAll(".approve").forEach(button => {
    button.addEventListener("click", async () => {

        const response = await fetch(
            "http://localhost:5000/api/maintenance/1/approve",
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        alert(data.message);
    });
});

// =========================
// Reject Buttons
// =========================
document.querySelectorAll(".reject").forEach(button => {
    button.addEventListener("click", async () => {

        const response = await fetch(
            "http://localhost:5000/api/maintenance/1/reject",
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        alert(data.message);
    });
});

// =========================
// Resolve Buttons
// =========================
document.querySelectorAll(".resolve").forEach(button => {
    button.addEventListener("click", async () => {

        const response = await fetch(
            "http://localhost:5000/api/maintenance/1/resolve",
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        alert(data.message);
    });
});

// Initial Load
loadMaintenance();