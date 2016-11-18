/**
 * Created by Hardik on 5/8/16.
 */

var nodemailer = require("nodemailer");

/*
var smtpTranport = nodemailer.createTransport("SMPT",{
    service: "Gmail",
    auth:{
        user:"hardik.spring2015@gmail.com",
        pass:"Hg588984"
    }
});

smtpTranport.sendMail({  //email options
    from: "hardik.spring2015@gmail.com", // sender address.  Must be the same as authenticated user if using Gmail.
    to: "gandhihardikm@gmail.com", // receiver
    subject: "Emailing with nodemailer", // subject
    text: "Email Example with nodemailer" // body
}, function(error, response){  //callback
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
});
*/
