const nodeMailer = require('nodemailer');



const emailClient = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_Email,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});


const emailService = {
    send: async (to, subject, body) => {
        const emailOptions = {
            from: process.env.GOOGLE_Email,
            to : to,
            subject: subject,
            text: body
        };

        await emailClient.sendMail(emailOptions);
    },
};

module.exports = emailService;