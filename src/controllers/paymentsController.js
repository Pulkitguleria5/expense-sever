const Razorpay = require('razorpay');
const crypto = require('crypto');
const Users = require('../model/users');
const { CREDIT_TO_PAISA_MAPPING } = require('../constants/paymentConstants');

const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentsController = {

  // Create Razorpay Order
  createOrder: async (request, response) => {
    try {
      const { credits } = request.body;

      // Validate credits
      if (!CREDIT_TO_PAISA_MAPPING[credits]) {
        return response.status(400).json({
          message: 'Invalid credit value'
        });
      }

      const amountInPaise = CREDIT_TO_PAISA_MAPPING[credits];

      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

      return response.json({ order });

    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  },

  // Verify Payment
  verifyOrder: async (request, response) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        credits
      } = request.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return response.status(400).json({ message: "Invalid transaction" });
      }

      const user = await Users.findById(request.user._id);
      user.credits += Number(credits);
      await user.save();

      return response.json({ user });

    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = paymentsController;
