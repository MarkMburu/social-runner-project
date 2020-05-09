const mongoose = require('mongoose');

const { Schema } = mongoose;

// this is a collection to save your Route schedule
const logEntrySchema = new Schema({
  date:Date,
  description: String,
  pace:Number,
  distance:Number,
  startingpointlat:Number,
  startingpointlong:Number,
  endpointlat:Number,
  endpointlong:Number,
  meetingpoint1long:Number,
  meetingpoint1lat:Number,
  meetingpoint2long:Number,
  meetingpoint2lat:Number,
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);
// exporting  the schema
module.exports = LogEntry;