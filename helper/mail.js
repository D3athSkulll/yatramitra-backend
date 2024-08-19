const pdf = require("html-pdf");
const genHTML = require("./html");
const nodemailer = require("nodemailer");
require("dotenv").config();
async function sendEmail(data, payment){
    console.log(data, payment);
    const html = genHTML(data, payment);
    pdf.create(html, {format: "A4"}).toBuffer((err, buffer)=>{
        if(err) return console.log(err);
        const email = process.env.EMAIL;
        const pass = process.env.PASS;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: email,
                pass: pass
            }
        });
        const mailOptions = {
            from:{
                name: "Yatra Mitra",
                address: email
            },
            to: data.email,
            subject: "Travel Ticket",
            html: html,
            attachments: [{
                filename: `${data.pnr}.pdf`,
                content: buffer,
                encoding: 'base64'
            }]
        };
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err);
            }
        });
    });
}
module.exports = sendEmail;