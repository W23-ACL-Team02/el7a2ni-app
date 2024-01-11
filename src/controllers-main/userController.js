const userModel = require('../models/user.js');
const notificationModel = require('../models/notification.js');
const { title } = require('process');

module.exports = {
    getNotifications: async (req, res) => {
        const userId = req.session?.userId;
        if (userId == undefined) {
            res.status(400).json({errors: ["No user in session."]})
            return;
        }

        try {
            const user = await userModel.findById(userId);
            let promises = [];
            for (let notif of user.notifications) {
                // user.notifications[notif].isRead = true;
                promises.push(
                    notificationModel.findById(
                        notif.notifId
                    )
                )
            }
            let notifs = await Promise.all(promises);
            res.status(200).json({notifs})
        } catch (error) {
            res.status(400).json({errors: ["Error fetching notifications."]})
            return;
        }
        
    }
}