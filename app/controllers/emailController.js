// controllers/paymentController.js
const emailService = require("../services/emailService");

exports.sendEmail = async (req, res) => {
  console.log(req.body)
  const { recipient } = req.body;
  try {
    if (recipient) {
      await emailService.sendEmail(req.body);
      res.status(200).json({ message: "Email sent successful" });
    } else {
      res.status(422).json({ message: "Invalid request data jjj" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
