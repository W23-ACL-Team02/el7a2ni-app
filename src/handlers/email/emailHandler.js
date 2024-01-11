const { createTransport } = require('nodemailer');
const { google } = require('googleapis');
const userModel = require('../../models/user');

// TODO: Move to .env
const USER_EMAIL = `team02.el7a2ni@gmail.com`
const USER_PASS = `el7a2ni!`
const CLIENT_ID = "647728874059-erljj4g1cucpv2bcl1215m192leu4u8j.apps.googleusercontent.com";
const CLIENT_SECRET = "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"
const REFRESH_TOKEN = "1//04Crn4SBgXtgSCgYIARAAGAQSNwF-L9Irnj4JV9IdBxOBsFTZcE-4qYUG3c3CNz8ccSkkXyAj63ASlU_kGmW9HAA0SpW0TDGBEXE";
const ACCESS_TOKEN = "ya29.a0AfB_byCOz91VlnrxL3PScaTgRB4zhzKcdQxvmwhav2VN8ONHwZ8TJXKaa7J1DbGh7SnIVmuQckLYvc1YO9zYUuPd4Bjfd4LmpyId9yaEy_QRFZicA3XGuYD5D_xwokoX2Dh6ZY0gTCKK6_NwT6Ok8d-TuK3MMsJD_3WqaCgYKAZkSARESFQHGX2MijQlGMSWUPsvnotkZuO-1ag0171";


const sendMail = async (userId, notificationObject) => {
    return new Promise(async (resolve, reject) => {

        let user = await userModel.findById(userId);
        
        let userEmail = user?.email;
        if (userEmail == undefined) {
            console.log(`[ERROR] Undefined email for user with ID ${userId}`)
            resolve(0);
        }

        // ? TODO: Create HTML version of notification? With template for each type of notif
        
        // Send out email
        var mailOptions = {
            from: USER_EMAIL,
            to: userEmail,
            subject: notificationObject.title,
            text: notificationObject.message
        };
        
        let transporter = await createTransport();
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(`[ERROR] Unable to send email.\n${error}`);
                resolve(0);
            } else {
                console.log('[EMAIL] Email sent: ' + info.response);
                resolve(1);
            }
        });
    })
}

const createTransporter = async () => {
    try {
        const oauth2Client = new google.auth.OAuth2(
          CLIENT_ID,
          CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
 
        oauth2Client.setCredentials({
          refresh_token: REFRESH_TOKEN,
        });
 
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              console.log("[ERROR] ", err)
              reject();
            }
            resolve(token); 
          });
        });
 
        const transporter = createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: USER_EMAIL,
            accessToken,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
          },
        });
        
        return transporter;
    } catch (err) {
      return err
    }
  };
 

module.exports = { sendMail }
