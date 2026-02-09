const expenseDao = require('../dao/expenseDao');
const groupDao = require('../dao/groupDao');

const expenseController = {

    create: async (request, response) => {
        try {
            const user = request.user;
            const { groupId, amount, description, date, paidBy, split } = request.body;

            if (!groupId || amount == null || !description || !paidBy || !Array.isArray(split)) {
                return response.status(400).json({ message: "Missing required fields" });
            }

            // check user is part of group
            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === groupId);

            if (!group) {
                return response.status(403).json({ message: "User not part of this group" });
            }

            // only admin can create expense
            if (group.adminEmail !== user.email) {
                return response.status(403).json({ message: "Only group admin can create expense" });
            }

            // validate paidBy user
            const paidByUser = await groupDao.getUserByEmail(paidBy);
            if (!paidByUser) {
                return response.status(400).json({ message: "Paid by user not found" });
            }

            const groupEmails = group.membersEmail;

            // validate split users
            for (const s of split) {
                if (!s.userEmail || s.splitAmount == null) {
                    return response.status(400).json({
                        message: "Each split item must have userEmail and splitAmount"
                    });
                }

                if (!groupEmails.includes(s.userEmail)) {
                    return response.status(400).json({
                        message: `User ${s.userEmail} is not a member of the group`
                    });
                }
            }

            // excluded members
            const excludedMembers = groupEmails.filter(email =>
                email !== paidBy &&
                !split.some(s => s.userEmail === email)
            );

            // validate split total
            const totalSplit = split.reduce((sum, s) => sum + Number(s.splitAmount), 0);
            if (totalSplit !== Number(amount)) {
                return response.status(400).json({
                    message: "Split amounts do not sum up to total amount"
                });
            }

            const newExpense = await expenseDao.createExpense({
                groupId,
                amount,
                description,
                date,
                paidBy,
                split,
                excludedMembers,
                settled: false
            });

            response.status(201).json({
                message: "Expense created successfully",
                expenseId: newExpense._id
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Internal server error" });
        }
    },

    update: async (request, response) => {
        try {
            const user = request.user;
            const { expenseId } = request.body;

            const expense = await expenseDao.getExpenseById(expenseId);
            if (!expense) {
                return response.status(404).json({ message: "Expense not found" });
            }

            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === expense.groupId.toString());

            if (!group || group.adminEmail !== user.email) {
                return response.status(403).json({ message: "Only group admin can update expenses" });
            }

            const updatedExpense = await expenseDao.updateExpense(request.body);
            response.status(200).json(updatedExpense);

        } catch (error) {
            response.status(500).json({ message: "Error updating expense" });
        }
    },

    getByGroupId: async (request, response) => {
        try {
            const user = request.user;
            const { groupId } = request.params;

            const groups = await groupDao.getGroupByEmail(user.email);
            const isMember = groups.some(g => g._id.toString() === groupId);

            if (!isMember) {
                return response.status(403).json({ message: "User is not a member of the group" });
            }

            const expenses = await expenseDao.getExpensesByGroupId(groupId);
            response.status(200).json(expenses);

        } catch (error) {
            response.status(500).json({ message: "Error fetching expenses" });
        }
    },

    getByExpenseId: async (request, response) => {
        try {
            const expense = await expenseDao.getExpenseById(request.params.expenseId);
            if (!expense) {
                return response.status(404).json({ message: "Expense not found" });
            }
            response.status(200).json(expense);

        } catch (error) {
            response.status(500).json({ message: "Error fetching expense" });
        }
    },

    delete: async (request, response) => {
        try {
            const user = request.user;
            const { expenseId } = request.params;

            const expense = await expenseDao.getExpenseById(expenseId);
            if (!expense) {
                return response.status(404).json({ message: "Expense not found" });
            }

            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === expense.groupId.toString());

            if (!group || group.adminEmail !== user.email) {
                return response.status(403).json({ message: "Only group admin can delete expenses" });
            }

            await expenseDao.deleteExpense(expenseId);
            response.status(200).json({ message: "Expense deleted successfully" });

        } catch (error) {
            response.status(500).json({ message: "Error deleting expense" });
        }
    },

    updateSplitAmount: async (request, response) => {
        try {
            const user = request.user;
            const { expenseId, userEmail, amount } = request.body;

            const expense = await expenseDao.getExpenseById(expenseId);
            if (!expense) {
                return response.status(404).json({ message: "Expense not found" });
            }

            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === expense.groupId.toString());

            if (!group || group.adminEmail !== user.email) {
                return response.status(403).json({ message: "Only group admin can update expenses" });
            }

            const updatedExpense = await expenseDao.updateSplitAmount(expenseId, userEmail, amount);

            const totalSplit = updatedExpense.split.reduce(
                (sum, s) => sum + Number(s.splitAmount),
                0
            );

            if (totalSplit !== updatedExpense.amount) {
                return response.status(400).json({
                    message: "Split amounts do not sum up to total amount"
                });
            }

            response.status(200).json(updatedExpense);

        } catch (error) {
            response.status(500).json({ message: "Error updating split amount" });
        }
    },

    addSplitUser: async (request, response) => {
        try {
            const user = request.user;
            const { expenseId, userEmail, amount } = request.body;

            const expense = await expenseDao.getExpenseById(expenseId);
            if (!expense) {
                return response.status(404).json({ message: "Expense not found" });
            }

            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === expense.groupId.toString());

            if (!group || group.adminEmail !== user.email) {
                return response.status(403).json({ message: "Only group admin can update expenses" });
            }

            if (!group.membersEmail.includes(userEmail)) {
                return response.status(400).json({
                    message: "User does not belong to the group of the expense"
                });
            }

            const updatedExpense = await expenseDao.addSplitUser(expenseId, userEmail, amount);
            response.status(200).json(updatedExpense);

        } catch (error) {
            response.status(500).json({ message: "Error adding split user" });
        }
    },

    getSummary: async (request, response) => {
        try {
            const user = request.user;
            const { groupId } = request.params;

            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === groupId);

            if (!group) {
                return response.status(403).json({ message: "User is not a member of the group" });
            }

            const expenses = await expenseDao.getUnsettledExpensesByGroupId(groupId);
            
            const balances = {};
            group.membersEmail.forEach(email => {
                balances[email] = 0;
            });

            expenses.forEach(expense => {
                const paidBy = expense.paidBy;
                const totalAmount = expense.amount;
                const paidByInSplit = expense.split.find(s => s.userEmail === paidBy);

                if (paidByInSplit) {
                    balances[paidBy] += (totalAmount - paidByInSplit.splitAmount);
                } else {
                    balances[paidBy] += totalAmount;
                }

                expense.split.forEach(splitItem => {
                    const splitUser = splitItem.userEmail;
                    const splitAmount = splitItem.splitAmount;

                    if (splitUser !== paidBy) {
                        balances[splitUser] -= splitAmount;
                    }
                });
            });

            const summary = group.membersEmail.map(email => ({
                userEmail: email,
                netBalance: balances[email]
            }));

            response.status(200).json({
                groupId,
                summary,
                isSettled: group.paymentStatus?.isPaid || false
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Error fetching expense summary" });
        }
    },

    settleGroup: async (request, response) => {
        try {
            const user = request.user;
            const { groupId } = request.body;

            const groups = await groupDao.getGroupByEmail(user.email);
            const group = groups.find(g => g._id.toString() === groupId);

            if (!group) {
                return response.status(403).json({ message: "User is not a member of the group" });
            }

            if (group.adminEmail !== user.email) {
                return response.status(403).json({ message: "Only group admin can settle the group" });
            }

            await expenseDao.markAllExpensesAsSettled(groupId);

            const updatedGroup = await groupDao.updateGroup({
                groupId,
                paymentStatus: {
                    amount: 0,
                    currency: 'INR',
                    date: Date.now(),
                    isPaid: true
                }
            });

            response.status(200).json({
                message: "Group settled successfully",
                group: updatedGroup
            });

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Error settling group" });
        }
    }
};

module.exports = expenseController;
