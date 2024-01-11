const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongodb');

const notifSchema = new Schema({
    receiverId: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    involvedUserId: { // If appointment, this will be the patient attending or doctor conducting
        type: ObjectId,
        ref: 'user'
    },
    medicineId: { // If medicine stock, this will contain the medicine affected
        type: ObjectId,
        ref: 'medicine'
    },
    notifType: {
        type: String,
        enum: ["appointmentCreated", "appointmentRescheduled", "appointmentCancelled", "medicineOutOfStock"]
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    userNotified: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    title: {
        type: String
    }
},  
{ 
    timestamps: true
});

const Notification = mongoose.model('notification', notifSchema);
module.exports = Notification;