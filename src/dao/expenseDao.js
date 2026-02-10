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

    updateSplitAmount: async (expenseId, userEmail, amount) => {
        return await Expense.findOneAndUpdate(
            { _id: expenseId, "split.userEmail": userEmail },
            {
                $set: { "split.$.splitAmount": amount }
            },
            { new: true }
        );
    },

    addSplitUser: async (expenseId, userEmail, amount) => {
        return await Expense.findByIdAndUpdate(
            expenseId,
            {
                $push: { split: { userEmail, splitAmount: amount } }
            },
            { new: true }
        );
    },

    deleteExpense: async (expenseId) => {
        return await Expense.findByIdAndDelete(expenseId);
    },

    getUnsettledExpensesByGroupId: async (groupId) => {
        return await Expense.find({ groupId, settled: false });
    },

    markAllExpensesAsSettled: async (groupId) => {
        return await Expense.updateMany(
            { groupId, settled: false },
            { $set: { settled: true } }
        );
    },

};








module.exports = expenseDao;

