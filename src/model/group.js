const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
 
  adminEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  membersEmail: [{ type: String, required: true }],
  thumbnail: { type: String, required: false },
  
  paymentStatus: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    date: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("Group", groupSchema);
