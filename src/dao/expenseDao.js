const { get } = require('mongoose');
const Expense = require('../model/expense');

const expenseDao = {

    createExpense: async (data) => {
        return await Expense.create(data);
    },


    updateExpense: async (data) => {
        const { expenseId, amount, description, date, paidBy, split, excludedMembers, settled } = data;

        return await Expense.findByIdAndUpdate(expenseId, {
            amount, description, date, paidBy, split, excludedMembers, settled
        }, { new: true });
    },

    getExpensesByGroupId: async (groupId) => {
        return await Expense.find({ groupId });
    },

    getExpenseById: async (expenseId) => {
        return await Expense.findById(expenseId);
    },

    updateSplitAmount: async (expenseId, userId, amount) => {
        return await Expense.findOneAndUpdate(
            { _id: expenseId, "split.userId": userId },
            {
                $set: { "split.$.splitAmount": amount }
            },
            { new: true }
        );
    },

    addSplitUser: async (expenseId, userId, amount) => {
        return await Expense.findByIdAndUpdate(
            expenseId,
            {
                $push: { split: { userId, splitAmount: amount } }
            },
            { new: true }
        );
    },

    deleteExpense: async (expenseId) => {
        return await Expense.findByIdAndDelete(expenseId);
    },










}



module.exports = expenseDao;

