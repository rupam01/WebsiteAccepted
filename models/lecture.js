var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// define the schema for our user model
var lectureSchema = new mongoose.Schema({
    lecture_num: Number,
    title: String,
    description: String,
    delivery_date: Date,
    slide_path: String,
    challenge_path: String,
    media_path: String,
    links: [{ name: String, description: String, url: String }],
});
// create the model for users and expose it to our app
var model = mongoose.model('Lecture', lectureSchema);
module.exports = model;
//# sourceMappingURL=lecture.js.map