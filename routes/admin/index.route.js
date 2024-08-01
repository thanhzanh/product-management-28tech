const dashboardRoutes = require('./dashboard.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
    //Lấy đường dẫn admin bên config/system
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

}