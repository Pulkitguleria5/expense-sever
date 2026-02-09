const { skipMiddlewareFunction } = require("mongoose");
const Group = require("../model/group");

const groupDao = {
    createGroup: async (data) => {
        return await Group.create(data);
    },

    updateGroup: async (data) => {
        const { groupId, name, description, thumbnail, adminEmail, paymentStatus } = data;

        return await Group.findByIdAndUpdate(groupId, {
            name, description, thumbnail, adminEmail, paymentStatus,
        }, { new: true });
    },

    addMembers: async (groupId, ...membersEmails) => {
        return await Group.findByIdAndUpdate(groupId, {
            $addToSet: { membersEmail: { $each: membersEmails }}
        }, { new: true });
    },

    removeMembers: async (groupId, ...membersEmails) => {
        return await Group.findByIdAndUpdate(groupId, {
            $pull: { membersEmail: { $in: membersEmails } }
        }, { new: true });
    },

    getGroupByEmail: async (email) => {
        return await Group.find({ membersEmail: email });
    },

    getGroupByStatus: async (status) => {
        // Take email as the input, then filter groups by email
        // Check in membersEmail field.
        return await Group.find({ "paymentStatus.isPaid": status });
    },

    /**
     * We'll only return when was the last time group
     * was settled to begin with.
     * In future, we can move this to separate entity!
     * @param {*} groupId 
     */
    getAuditLog: async (groupId) => {
        // Based on your schema, the most relevant "settled" info 
        // is the date within paymentStatus.
        const group = await Group.findById(groupId).select('paymentStatus.date');
        return group ? group.paymentStatus.date : null;
    },

    getGroupsPaginated: async (email, limit ,skip,sortOptions ={createdAt:-1}) => {
        //find groups by email, 
        //then sort to preserve order

        const [groups, total] = await Promise.all([
            Group.find({ membersEmail: email })
            .sort({sortOptions})
            .skip(skip)
            .limit(limit),

            //cout number of groups for pagination
            Group.countDocuments({ membersEmail: email })
        ]);

        return { groups, total };
    },

    getGroupById: async (groupId) => {
        return await Group.findById(groupId);
    },
};

module.exports = groupDao;



//promises takes array of function run them parallel and return the result when all of them are done. It is useful when you have multiple async operations that can be run in parallel, and you want to wait for all of them to complete before proceeding. For example, if you have an array of user IDs and you want to fetch their details from the database, you can use Promise.all to run all the fetch operations in parallel and get the results once they are all done.