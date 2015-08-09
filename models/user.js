var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// define the schema for our user model
var userSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});
// methods ======================
// generating a hash
userSchema.method('validPassword', function (password) {
    return bcrypt.compareSync(password, this.local.password);
});
userSchema.method('generateHash', function (password) { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); });
// create the model for users and expose it to our app
var model = mongoose.model('User', userSchema);
module.exports = model;
//# sourceMappingURL=user.js.map