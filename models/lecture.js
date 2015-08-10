var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// define the schema for our user model
var lectureSchema = new mongoose.Schema({
    lecture_num: Number,
    title: String,
    short_title: String,
    description: String,
    delivery_date: Date,
    has_media: Boolean,
    links: [{ name: String, description: String, url: String }],
});
lectureSchema.method('getToken', function () {
    var that = this; // var yes: IAffirmation = indeedly;
    return 'Lecture' + this.lecture_num + '_' + that.short_title;
});
// create the model for users and expose it to our app
var model = mongoose.model('Lecture', lectureSchema);
module.exports = model;
//# sourceMappingURL=lecture.js.map