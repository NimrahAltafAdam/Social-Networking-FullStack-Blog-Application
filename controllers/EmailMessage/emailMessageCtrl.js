//STEP 59
const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const EmailMsg = require("../../model/EmailMessaging/EmailMessaging");
const sgMail = require("@sendgrid/mail");

const sendEmailMsgCtrl = expressAsyncHandler(async (req,res) => {
  const {_id} = req.user;
  const {to, subject, message} = req.body;
  const emailMessage = subject + ' ' + message;
  //prevent profanity/bad words
  const filter = new Filter()
  const isProfane = filter.isProfane(emailMessage);
  if(isProfane) {
    /*await EmailMsg.findByIdAndUpdate(_id, {
      isFlagged: true
    });*/
    throw new Error("Email sent failed beacause your message contains profane words");
  };

  try {
    //build up message
    const msg = {
      to,
      from : "nimrahadam.123@gmail.com",
      subject,
      text: message,
    };
    //send msg
    await sgMail.send(msg);
    //save in db
    await EmailMsg.create({
      sentBy: req?.user?._id,
      from : req?.user?.email,
      to: req.body.to,
      message: req.body.message,
      subject: req.body.subject,
    });
    res.json("Email Sent")
  } catch (error) {
    res.json(error)
  }

});

module.exports = sendEmailMsgCtrl; //set the route and then requie the route in server.js