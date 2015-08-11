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
export var model = mongoose.model<ISurvey>('Survey', surveySchema);
//export = model;
export function getRawSurveyData(lecture_num, callback) {
    model.find({ lecture_num: lecture_num }, function (err, surveys) {
        if (err) {
            console.log(err);
            throw err;
        }
        var result = JSON.stringify(surveys, null, '\t');
        console.log(result);
        callback(result);
    });
};
export function getSurveyData(lecture_num, callback) {
    model.find({ lecture_num: lecture_num }, function (err, surveys) {
        if (err) {
            console.log(err);
            throw err;
        }
        var count = surveys.length;
        //console.log("count:" + count);
        var totals = {};
        var comments = {};
        var overallComments = "";
        for (var i = 0; i < surveys.length; i++) {
            var surv = surveys[i];
            if (surv.comment) {
                overallComments += surv.comment + '\n';
            }
            for (var j = 0; j < surv.questions.length; j++) {
                var q = surv.questions[j];
            //for (var q in surv.questions) {
                if (!totals[q.num]) totals[q.num] = 0;
                totals[q.num] += q.rating;
                if (q.comment) {
                    if (!comments[q.num]) comments[q.num] = "";
                    comments[q.num] += '\n\t\t' + q.comment;
                }
            }
            
        }
        var result = "Workshop #" + lecture_num + "\nSurveys Completed: " + count + "\n";

        for (var qnum in totals) {
            var average = totals[qnum] / count;
            result += qnum + '. ' + getQuestionText(qnum) + '\n';
            result += '\tAverage: ' + average;
            if (comments[qnum]) {
                result += '\n\tComments: ' + comments[qnum];
            }
            result += '\n';
        }
        result += '\nWorkshop Comments:\n-------------\n' + overallComments;
        console.log(result);
        callback(result);
    });
};

export function getQuestionText(questionNum) {
    switch (questionNum) {
        case "1": return "The curriculum was presented in an EASY TO UNDERSTAND manner.";
        case "2": return "The pace of the curriculum was appropriate.";
        case "3": return "I was able to CLEARLY HEAR the presenter.";
        case "4": return "Today's workshop seemed WELL-ORGANIZED.";
        case "5": return "Today's workshop MET MY EXPECTATIONS.";
    }
    return "-";
};