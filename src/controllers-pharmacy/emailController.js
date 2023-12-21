const express = require("express");
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const userModel = require("../models/user");

const CLIENT_ID = "4947102545-nsinab6puoadhmtinsne81c5u35niahq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN = "1//04nRjuhmWQtUUCgYIARAAGAQSNwF-L9IrVSzsG0meTJ7YKjgQqQ6Bnseq7Lbx5ChRHAdBHbYl6-2lPRD_pvDax48L7upTuogwhw8";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const MY_EMAIL = "el7a2ni.pharmacy@gmail.com";

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

module.exports = {
    sendEmail:  async (req, res) => {
        const subject = req.body.subject
        const html = req.body.html
        //const userID = req.session.userId;
        const userID = "6547b96606043724533eedbf" 
        try{
            const user = userModel.findOne({_id: userID});
            const clientEmail = user.email
            const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: MY_EMAIL,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: ACCESS_TOKEN,
                },
                tls: {
                    rejectUnauthorized: true,
                },
            });   
            
            const info = await transporter.sendMail({
                from: MY_EMAIL,
                to: clientEmail,
                subject: subject,
                html: html,
            })

            res.status(200).send("Email was sent")
        }catch(error){
            res.status(400).json({error: error})
        }
    }    
}