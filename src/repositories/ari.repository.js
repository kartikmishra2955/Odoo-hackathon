const prisma = require("../prisma/prismaClient");

const getAssets = async () => {

    return prisma.asset.findMany({
        include: {
            allocations: true,
            bookings: true
        }
    });

};

module.exports = {
    getAssets
};