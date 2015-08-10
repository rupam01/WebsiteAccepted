import mongoose = require('mongoose');
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
interface ILecture extends mongoose.Document {
    lecture_num: number,
    title: string,
    short_title: string,
    description: string,
    delivery_date: Date,
    has_media: boolean,
    links: [{ name: string, description: string, url: string }],

    getToken(): string,
}
lectureSchema.method('getToken', function () {
    var that: ILecture = this; // var yes: IAffirmation = indeedly;
    return 'Lecture' + this.lecture_num + '_' + that.short_title;
});


// create the model for users and expose it to our app
var model = mongoose.model<ILecture>('Lecture', lectureSchema);
export = model;