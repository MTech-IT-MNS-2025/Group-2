
const { Schema, model, models, Types } = require('mongoose');

const MessageSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = models.Message || model('Message', MessageSchema);
module.exports = Message;
