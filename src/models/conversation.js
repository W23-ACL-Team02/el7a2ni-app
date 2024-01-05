const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongodb');

const conversationSchema = new Schema({
    creatorId: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    creatorRead: {
        type: Boolean,
        default: true
    },
    receiverId: {
        type: ObjectId,
        ref: 'user'
    },
    receiverRead: {
        type: Boolean,
        default: false
    },
    receiverType: {
        type: String
    },
    isOpenConversation: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        type: ObjectId,
        ref: 'message'
    }
}, {
    timestamps: true,
    methods: {
        checkUserParticipant(userId, userType) {
            if (this.creatorId != userId && this.receiverId != userId) {
                if (!this.isOpenConversation) {
                    return false
                } else if (this.receiverType != userType) {
                    return false
                }
            }

            return true;
        }
    }
});

const Conversation = mongoose.model('conversation', conversationSchema);
module.exports = Conversation;