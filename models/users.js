/// <reference path="../typings/sequelize/sequelize.d.ts"/>
// app/models/user.js
// load the things we need
var Sequelize = require('sequelize');
var sequelize = require('../config/database.js');
var bcrypt = require('bcrypt-nodejs');
var User = sequelize.define('user', {
    local_email: Sequelize.STRING,
    local_password: Sequelize.STRING,
    google_id: Sequelize.STRING,
    google_token: Sequelize.STRING,
    google_email: Sequelize.STRING,
    google_name: Sequelize.STRING,
});
module.exports = User;
module.exports.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
module.exports.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local_password);
};
//# sourceMappingURL=users.js.map