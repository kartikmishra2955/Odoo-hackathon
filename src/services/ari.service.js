const repository = require("../repositories/ari.repository");

const calculateRisk = async () => {

    const assets = await repository.getAssets();

    return assets.map(asset => {

        let score = 0;

        score += asset.allocations.length * 15;

        score += asset.bookings.length * 10;

        if (asset.condition === "FAIR") score += 15;

        if (asset.condition === "POOR") score += 30;

        let level = "LOW";

        if (score >= 60) {

            level = "HIGH";

        } else if (score >= 30) {

            level = "MEDIUM";

        }

        return {

            assetId: asset.id,

            assetName: asset.assetName,

            allocationFrequency: asset.allocations.length,

            bookingFrequency: asset.bookings.length,

            condition: asset.condition,

            riskScore: score,

            riskLevel: level,

            recommendation:
                level === "HIGH"
                    ? "Schedule preventive maintenance"
                    : level === "MEDIUM"
                    ? "Monitor asset"
                    : "Healthy"

        };

    });

};

module.exports = {
    calculateRisk
};