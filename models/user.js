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
        name: String,
        datecreated: Date,
    },
    lecture_surveys_completed: Object
});
// methods ======================
// generating a hash
userSchema.method('validPassword', function (password) {
    return bcrypt.compareSync(password, this.local.password);
});
userSchema.method('generateHash', function (password) { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); });
userSchema.method('hasCompletedSurvey', function (lecture_num) {
    if (this.lecture_surveys_completed == undefined) {
        this.lecture_surveys_completed = {};
        console.log("NEW OBJECT! in hasCompletedSurvey");
    }
    else {
        console.log("NOT NEW OBJECT! in hasCompletedSurvey:" + JSON.stringify(this.lecture_surveys_completed, null, '\t')); //[lecture_num]);
        console.log("lecture_num:" + lecture_num);
        var innovate = "" + lecture_num;
        console.log('innovate:' + innovate);
        console.log("NOT NEW OBJECT! in hasCompletedSurvey2:" + this.lecture_surveys_completed["" + lecture_num]); //[lecture_num]);
        console.log("thisoldthing?:" + typeof this.lecture_surveys_completed);
    }
    return this.lecture_surveys_completed["" + lecture_num] == true;
});
userSchema.method('completeSurvey', function (lecture_num) {
    if (this.lecture_surveys_completed == undefined) {
        this.lecture_surveys_completed = {};
    }
    //else {
    //    console.log("NOT NEW OBJECT! in completeSurvey");
    //}
    this.lecture_surveys_completed[lecture_num] = true;
});
// create the model for users and expose it to our app
var model = mongoose.model('User', userSchema);
module.exports = model;
//# sourceMappingURL=user.js.map