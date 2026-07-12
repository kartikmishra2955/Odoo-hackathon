const ariService = require("../services/ari.service");

const getRisk = async (req, res) => {

    try {

        const data = await ariService.calculateRisk();

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    getRisk
};