const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongodb');

const messageSchema = new Schema({
    conversationId: {
        type: ObjectId,
        ref: 'conversation',
        required: true
    },
    senderId: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    receiverId: {
        type: ObjectId,
        ref: 'user'
    },
    content: {
        type: String
    }
}, {
    timestamps: true
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;