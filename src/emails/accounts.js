const sgMail = require('@sendgrid/mail');
const sendGridApiKey= process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridApiKey);


const sendWelcomeEmail=(email, name)=>{
    sgMail.send({
        to : email,
        from : "adaksritiman24@gmail.com",
        subject : "Thanks for joining Task App",
        text : `Welcome to the task app ${name}! Let me know how you get along with the app.`
    })
}  

const sendCancellationEmail= (email, name)=>{
    sgMail.send({
        to: email, 
        from : "adaksritiman24@gmail.com",
        subject : "Cancellation of membership from Task App.",
        text : `Hi ${name}! Your membership was succcessfully cancelled. Please give us feedback on our services.\nRegards\nTeam Task App`,
        
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}