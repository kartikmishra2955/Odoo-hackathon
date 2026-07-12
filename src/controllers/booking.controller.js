const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
    try {

        const booking = await bookingService.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createBooking
};