const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currentWeekNumber = require('current-week-number');
const currentDB = new Date().getFullYear() + '_cw_' + currentWeekNumber();

const answers_DB = mongoose.connection.useDb('survey_answers');

const answerSchema = new Schema({
  unique_id: {
    type: String,
    required: true,
  },
  answers: {
    q1: {
      answer: {
        type: Number,
        default: null,
      },
    },
    q2: {
      answer: {
        type: Number,
        default: null,
      },
    },
    q3: {
      answer: {
        type: Number,
        default: null,
      },
    },
  },
});

module.exports = answers_DB.model(currentDB, answerSchema);
