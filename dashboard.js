console.log("Dashboard Loaded Successfully");

async function loadDashboard() {
    try {
        const maintenanceResponse = await fetch(
            "http://localhost:5000/api/maintenance"
        );

        const maintenanceData = await maintenanceResponse.json();

        const auditResponse = await fetch(
            "http://localhost:5000/api/audit"
        );

        const auditData = await auditResponse.json();

        console.log("Maintenance Data:", maintenanceData);
        console.log("Audit Data:", auditData);

    } catch (error) {
        console.error(error);
    }
}

// Dashboard card click functionality
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        const title = card.querySelector("h3").innerText;

        switch(title) {
            case "Total Assets":
                alert("Total Assets Overview Opened");
                break;

            case "Pending Maintenance":
                window.location.href = "maintenance.html";
                break;

            case "Open Audits":
                window.location.href = "audit.html";
                break;

            case "Critical Assets":
                window.location.href = "risk.html";
                break;

            default:
                alert(title);
        }
    });
});

loadDashboard();