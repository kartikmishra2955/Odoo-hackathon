console.log("Audit Module Loaded Successfully");

// =========================
// Load Audit Data
// =========================
async function loadAudit() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/audit"
        );

        const data = await response.json();

        console.log("Audit Data:", data);

    } catch (error) {
        console.error("Load Error:", error);
    }
}

// =========================
// Create Audit
// =========================
document.querySelector(".create-btn")
?.addEventListener("click", async () => {

    try {
        const response = await fetch(
            "http://localhost:5000/api/audit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    assetId: "ASSET-101",
                    auditor: "Anand"
                })
            }
        );

        const data = await response.json();

        console.log(data);

        alert(
            data.message ||
            "Audit Created Successfully"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Audit Created Successfully"
        );
    }
});

// =========================
// Start Audit
// =========================
document.querySelectorAll(".start")
.forEach(button => {

    button.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/audit/1/start",
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            console.log(data);

            alert(
                data.message ||
                "Audit Started Successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Audit Started Successfully"
            );
        }
    });
});

// =========================
// Close Audit
// =========================
document.querySelectorAll(".close")
.forEach(button => {

    button.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/audit/1/close",
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            console.log(data);

            alert(
                data.message ||
                "Audit Closed Successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Audit Closed Successfully"
            );
        }
    });
});

// Initial Load
loadAudit();
