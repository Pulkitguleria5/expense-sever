 
const Group = require("../model/group");

const groupDao = {
  createGroup: async (data) => {
    return await Group.create(data);
  },

  updateGroup: async (data) => {
    const { name, groupId, description, thumbnail, adminEmail, paymentStatus } = data;
    return await Group.findByIdAndUpdate(
      groupId,
      {
        name,
        description,
        thumbnail,
        adminEmail,
        paymentStatus,
      },
      { new: true }, // new = true will return the updated document
    );
  },

  addMember: async (groupId, ...membersEmail) => {
    return await Group.findByIdAndUpdate(
      groupId,
      {
        $addToSet: { membersEmail: { $each: membersEmail } },
      },
      { new: true },
    );
  },

  removeMember: async (groupId, ...membersEmail) => {
    return await Group.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          membersEmail: { $in: membersEmail },
        },
      },
      { new: true },
    );
  },

  getGroupByEmail: async (email) => {
  return await Group.find({ membersEmail: email });
  },

  getGroupByStatus: async (status) => {
  return await Group.find({ "paymentStatus.isPaid": status });
  },

  // NOTE: There is no audit-log schema yet; this is a placeholder using Group itself.
  getAuditLogs: async (groupId) => {
    const group = await Group.findById(groupId).select('paymentStatus.date');
    return group ? group.paymentStatus : null;
  },
};

module.exports = groupDao;