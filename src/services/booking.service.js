const prisma = require("../prisma/prismaClient");
const bookingRepository = require("../repositories/booking.repository");

const createBooking = async (data) => {

    const asset = await prisma.asset.findUnique({
        where: {
            id: Number(data.assetId)
        }
    });

    if (!asset) {
        throw new Error("Asset not found");
    }

    const overlap = await bookingRepository.getOverlappingBooking(
        Number(data.assetId),
        data.startDate,
        data.endDate
    );

    if (overlap) {
        throw new Error("Asset already booked for selected duration");
    }

    return bookingRepository.createBooking({
        assetId: Number(data.assetId),
        employeeName: data.employeeName,
        employeeId: data.employeeId || null,
        department: data.department,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        purpose: data.purpose || null
    });
};

module.exports = {
    createBooking
};