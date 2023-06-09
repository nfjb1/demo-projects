const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currentWeekNumber = require('current-week-number');
const currentDB = new Date().getFullYear() + '_CW_' + currentWeekNumber();

const questions_answered_DB = mongoose.connection.useDb('questions_answered');

const hasAnsweredSchema = new Schema({
  hashed_id: {
    type: String,
    required: true,
  },
  unique_id: {
    type: String,
    required: true,
  },
  answers: {
    q1: {
      answered: {
        type: Boolean,
        default: false,
      },
    },
    q2: {
      answered: {
        type: Boolean,
        default: false,
      },
    },
    q3: {
      answered: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
});

module.exports = questions_answered_DB.model(currentDB, hasAnsweredSchema);
