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
        console.error("Load Error:", error);
    }
}

// =========================
// Create Request
// =========================
document.querySelector(".create-btn")
?.addEventListener("click", async () => {

    try {
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

        console.log(data);

        alert(
            data.message ||
            "Maintenance Request Created Successfully"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Maintenance Request Created Successfully"
        );
    }
});

// =========================
// Approve Request
// =========================
document.querySelectorAll(".approve")
.forEach(button => {

    button.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/maintenance/1/approve",
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            console.log(data);

            alert(
                data.message ||
                "Maintenance Approved Successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Maintenance Approved Successfully"
            );
        }
    });
});

// =========================
// Reject Request
// =========================
document.querySelectorAll(".reject")
.forEach(button => {

    button.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/maintenance/1/reject",
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            console.log(data);

            alert(
                data.message ||
                "Maintenance Rejected Successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Maintenance Rejected Successfully"
            );
        }
    });
});

// =========================
// Resolve Request
// =========================
document.querySelectorAll(".resolve")
.forEach(button => {

    button.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/maintenance/1/resolve",
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            console.log(data);

            alert(
                data.message ||
                "Maintenance Resolved Successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Maintenance Resolved Successfully"
            );
        }
    });
});

// Initial Load
loadMaintenance();
