const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date,default: Date.now() },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    split :[{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            splitAmount: { type: Number, required: true },
    }],
    excludedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    settled: { type: Boolean, default: false }




})