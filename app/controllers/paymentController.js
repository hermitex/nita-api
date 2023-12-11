// controllers/paymentController.js
const paymentService = require("../services/paymentService");

exports.makePayment = async (req, res) => {
  console.log(req.body)
  const { partyA, partyB, amount } = req.body;
  try {
    if (partyA && partyB && amount) {
      await paymentService.processPayment(req.body);
      res.status(200).json("Payment successful");
    } else {
      res.status(422).json("Invalid request data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error" );
  }
};
