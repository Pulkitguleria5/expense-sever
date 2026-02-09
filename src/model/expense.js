const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date,default: Date.now() },
    paidBy: { type: String, required: true },

    split :[{
            userEmail: { type: String, required: true },
            splitAmount: { type: Number, required: true },
    }],
    excludedMembers: [{ type: String, required: false }],
    settled: { type: Boolean, default: false }




})
module.exports = mongoose.model('Expense', expenseSchema);