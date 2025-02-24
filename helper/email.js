const nodeMailer = require('nodemailer'); 
require('dotenv').config();
const userEmail = process.env.user_Email;
const passEmail = process.env.pass_Email;


const sendMail = async ( options ) => {
    const transporter = await nodeMailer.createTransport({
        service : "gmail",
        secure: true,
        auth: {
            user: "kristenhosh@gmail.com",
            pass: "ekqqvrmhufzmcuit"
        },
        tls:{
            //Bypass SSL verification
            rejectUnauthorized:false,
        }
    });
    const mailOption = {
        subject: options.subject, text:options.text, from:"kristenhosh@gmail.com", to:options.email, html:options.html
    };
    await transporter.sendMail(mailOption)
}
module.exports = sendMail;