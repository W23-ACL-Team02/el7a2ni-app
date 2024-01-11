const userModel = require('../../models/user');
const notificationModel = require('../../models/notification');
const appointmentTemplate = require('./templates/appointmentTemplate');
const medicineTemplate = require('./templates/medicineTemplate');
const { sendMail } = require('../email/emailHandler');


const createNotif = async ({}) => {
    // TODO Create Basic Notification
    console.log(`[Notif] Creating Basic Notifications NOT YET IMPLEMENTED`)
}

const createAppointmentNewNotif = async (schedulerId, attendingId) => {
    // Wait for users to be found
    let [userScheduler, userAttending] = await Promise.all([userModel.findById(schedulerId), userModel.findById(attendingId)]);

    let title = appointmentTemplate.appointmentTitleRescheduled();

    // Create a notification for the canceller
    let messageScheduler = appointmentTemplate.appointmentBodyNewScheduler(userScheduler.type, userAttending.name);
    let notificationScheduler = notificationModel.create({
        receiverId: schedulerId, 
        involvedUserId: attendingId,
        notifType: "appointmentCreated", 
        message: messageScheduler, 
        title
    })

    // Create a notification for the attending user
    let messageAttending = appointmentTemplate.appointmentBodyNewAttending(userAttending.type, userScheduler.name);
    let notificationAttending = notificationModel.create({
        receiverId: attendingId, 
        involvedUserId: schedulerId,
        notifType: "appointmentCreated", 
        message: messageAttending, 
        title
    })

    let notifications = await Promise.all([notificationScheduler, notificationAttending])
    return Promise.all([notifications[0].save(), notifications[1].save()])
}

/**
 * Create a notification for a rescheduled appointment.
 * 
 * @param {*} reschedulerId User ID of who reschedule
 * @param {*} attendingId User ID of the otehr user involved
 * @param {*} date 
 */
const createAppointmentRescheduledNotif = async (reschedulerId, attendingId, date) => {
    // Wait for users to be found
    let [userRescheduler, userAttending] = await Promise.all([userModel.findById(reschedulerId), userModel.findById(attendingId)]);

    let title = appointmentTemplate.appointmentTitleRescheduled();

    // Create a notification for the canceller
    let messageRescheduler = appointmentTemplate.appointmentBodyRescheduledRescheduler(userRescheduler.type, userAttending.name);
    let notificationRescheduler = notificationModel.create({
        receiverId: reschedulerId, 
        involvedUserId: attendingId,
        notifType: "appointmentRescheduled", 
        message: messageRescheduler, 
        title
    })

    // Create a notification for the attending user
    let messageAttending = appointmentTemplate.appointmentBodyRescheduledAttending(userAttending.type, userRescheduler.name);
    let notificationAttending = notificationModel.create({
        receiverId: attendingId, 
        involvedUserId: reschedulerId,
        notifType: "appointmentRescheduled", 
        message: messageAttending, 
        title
    })

    let notifications = await Promise.all([notificationRescheduler, notificationAttending])
    return Promise.all([notifications[0].save(), notifications[1].save()])
}

/**
 * Create a notification for a cancelled appointment.
 * 
 * @param {*} cancelerId User ID of who cancelled
 * @param {*} attendingId User ID of the otehr user involved
 * @param {*} date 
 */
const createAppointmentCancelledNotif = async (cancellerId, attendingId, date) => {
    // Wait for users to be found
    let [userCanceller, userAttending] = await Promise.all([userModel.findById(cancellerId), userModel.findById(attendingId)]);

    let title = appointmentTemplate.appointmentTitleCancelled();

    // Create a notification for the canceller
    let messageCanceller = appointmentTemplate.appointmentBodyCancelledCanceller(userCanceller.type, userAttending.name);
    let notificationCanceller = notificationModel.create({
        receiverId: cancellerId, 
        involvedUserId: attendingId,
        notifType: "appointmentCancelled", 
        message: messageCanceller, 
        title
    })

    // Create a notification for the attending user
    let messageAttending = appointmentTemplate.appointmentBodyCancelledAttending(userAttending.type, userCanceller.name);
    let notificationAttending = notificationModel.create({
        receiverId: attendingId, 
        involvedUserId: cancellerId,
        notifType: "appointmentCancelled", 
        message: messageAttending, 
        title
    })

    let notifications = await Promise.all([notificationCanceller, notificationAttending])
    return Promise.all([notifications[0].save(), notifications[1].save()])
}

const createMedicineOutOfStockNotif = async (pharmacistId, medicineId, medicineName) => {
    const receiverId = pharmacistId;
    const message = medicineTemplate.medicineBodyOutOfStock(medicineName);
    const title = medicineTemplate.medicineTitleOutOfStock();

    // Create a notification for the pharmacist
    let notification = await notificationModel.create({
        receiverId, 
        medicineId, 
        notifType: "medicineOutOfStock", 
        message, 
        title
    })

    return notification.save();
}

/**
 * Notification Handler that checks for all notifications that have not had their:
 * - Emails sent
 * - Notification on the system shown (Web App)
 * 
 * 
 * This functions should be run periodically.
 */
const handle = async () => { 
    console.log(`[Notif] Handling notifications...`)

    let [emailCount, systemCount] = await Promise.all([handleEmailNotify(), handleUserNotify()]);
    
    if (emailCount == 0 && systemCount == 0) {
        console.log(`[Notif] Nothing to handle.`)
    }

    if (emailCount > 0) console.log(`[Notif] Handled ${emailCount} email notifications.`)
    if (systemCount > 0) console.log(`[Notif] Handled ${systemCount} system notifications.`)
}

const handleEmailNotify = async () => {
    return new Promise(async (resolve, reject) => {
        resolve(0)
        return
        // Fetch notifications that need the user to be notified
        let notifs = await notificationModel.find({emailSent: false});
        
        // Iterate over notifications and update each user
        let results = [];
        let saveQueue = [];
        for (let notif of notifs) {
            results.push(sendMail(notif.receiverId, notif));

            notif.emailSent = true;
            saveQueue.push(notif.save());
        }
        
        await Promise.all(saveQueue);

        Promise.all(results).then(result => {
            if (result.length < 1) {
                resolve(0);
                return;
            }

            resolve(result.reduce((a, b) => a + b));
        })
    });
}

const handleUserNotify = async () => {
    return new Promise(async (resolve, reject) => {
        // Fetch notifications that need the user to be notified
        let notifs = await notificationModel.find({userNotified: false});
        
        // Iterate over notifications and update each user
        let results = [];
        for (let notif of notifs) {
            userModel.findByIdAndUpdate(notif.receiverId, { 
                $push: {
                    notifications: {
                        notifId: notif._id,
                        isRead: false
                    }
                }
            }).then((currResult) => {
            notif.userNotified = true;
            results.push(notif.save());
        }).catch((error) => {
            console.log(error.message)
        });
        }
        
        Promise.all(results).then(result => {
            resolve(result.length);
        })
    });
} 

module.exports = {createAppointmentNewNotif, createAppointmentRescheduledNotif, 
    createAppointmentCancelledNotif, createMedicineOutOfStockNotif, handle}