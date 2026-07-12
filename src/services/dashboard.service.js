const repository = require("../repositories/dashboard.repository");

const getDashboard = async () => {

    return await repository.getDashboardData();

};

module.exports = {
    getDashboard
};