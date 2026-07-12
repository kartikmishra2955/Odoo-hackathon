const prisma = require("../prisma/prismaClient");

// Create Booking
const createBooking = async (data) => {
    return prisma.booking.create({
        data,
    });
};

// Check overlapping bookings
const getOverlappingBooking = async (assetId, startDate, endDate) => {
    return prisma.booking.findFirst({
        where: {
            assetId: Number(assetId),
            status: {
                in: ["PENDING", "APPROVED"],
            },
            AND: [
                {
                    startDate: {
                        lte: new Date(endDate),
                    },
                },
                {
                    endDate: {
                        gte: new Date(startDate),
                    },
                },
            ],
        },
    });
};

// Get all bookings
const getAllBookings = async () => {
    return prisma.booking.findMany({
        include: {
            asset: true,
        },
    });
};

// Get booking by ID
const getBookingById = async (id) => {
    return prisma.booking.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            asset: true,
        },
    });
};

// Update booking status
const updateBookingStatus = async (id, status) => {
    return prisma.booking.update({
        where: {
            id: Number(id),
        },
        data: {
            status,
        },
    });
};

module.exports = {
    createBooking,
    getOverlappingBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
};