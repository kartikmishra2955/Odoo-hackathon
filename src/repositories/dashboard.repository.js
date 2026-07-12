const prisma = require("../prisma/prismaClient");

const getDashboardData = async () => {

    const totalAssets = await prisma.asset.count();

    const availableAssets = await prisma.asset.count({
        where: {
            status: "AVAILABLE"
        }
    });

    const allocatedAssets = await prisma.asset.count({
        where: {
            status: "ALLOCATED"
        }
    });

    const maintenanceAssets = await prisma.asset.count({
        where: {
            status: "MAINTENANCE"
        }
    });

    const totalBookings = await prisma.booking.count();

    const recentAllocations = await prisma.allocation.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc"
        }
    });

    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc"
        }
    });

    return {
        totalAssets,
        availableAssets,
        allocatedAssets,
        maintenanceAssets,
        totalBookings,
        recentAllocations,
        recentBookings
    };

};

module.exports = {
    getDashboardData
};