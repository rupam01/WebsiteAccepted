import mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var lectureSchema = new mongoose.Schema({
    token: String,
    lecture_num: Number,
    title: String,
    description: String,
    delivery_date: Date,
    slide_path: String,
    challenge_path: String,
    media_path: String,
    links: [{ name: String, description: String, url: String }],

});

interface ILecture extends mongoose.Document {
    token: string,
    lecture_num: number,
    title: string,
    description: string,
    delivery_date: Date,
    slide_path: string,
    challenge_path: string,
    media_path: string,
    links: [{ name: string, description: string, url: string }],
}

// create the model for users and expose it to our app
var model = mongoose.model<ILecture>('Lecture', lectureSchema);
export = model;