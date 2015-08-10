import mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var surveySchema = new mongoose.Schema({
    lecture_num: Number,
    date: Date,
    questions: [{
        num: Number,
        rating: Number,
        comment: String
    }],
    comment: String,
});
interface ISurvey extends mongoose.Document {
    lecture_num: number,
    date: Date,
    questions: [{
        num: number,
        rating: number,
        comment: string
    }],
    comment: string,
    getQuestionText (questionNum:number): string,
}

// create the model for users and expose it to our app
var model = mongoose.model<ISurvey>('Survey', surveySchema);
export = model;

var schemaVar: any = surveySchema;
schemaVar.statics.getSurveyData = function (lecture_num, callback) {
    model.find({ lecture_num: lecture_num }, function (err, surveys) {
        if (err) throw err;
        var count = surveys.length;
        var totals = {};
        var comments = {};
        for (var surv in surveys) {
            for (var q in surv.questions) {
                if (!totals.hasOwnProperty(q.num)) totals[q.num] = 0;
                totals[q.num] += q.rating;
                if (q.comment) {
                    if (!comments.hasOwnProperty(q.num)) comments[q.num] = "";
                    comments[q.num] += q.comment + '\n';
                }
            }
        }
        var result = "";
        for (var qnum in totals) {
            var average = totals[qnum] / count;
            result += qnum + '. ' + schemaVar.statics.getQuestionText(qnum) + '\n';
            result += 'Average: ' + average;
            if (comments[qnum]) {
                result += 'Comments: ' + comments[qnum];
            }
        }
        console.log(result);
        callback(result);
    });
};

schemaVar.statics.getQuestionText = function (questionNum) {
    switch (questionNum) {
        case 1: return "The curriculum was presented in an EASY TO UNDERSTAND manner.";
        case 2: return "The pace of the curriculum MOVED SLOWLY ENOUGH for me to follow.";
        case 3: return "The pace of the curriculum MOVED QUICKLY ENOUGH to keep me engaged.";
        case 4: return "I was able to CLEARLY HEAR the presenter.";
        case 5: return "Today's workshop seemed WELL-ORGANIZED.";
        case 6: return "Today's workshop MET MY EXPECTATIONS.";
    }
    return "-";
};