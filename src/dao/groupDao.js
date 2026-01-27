const groupDao = {
  createGroup: async (Data) => {
    return await Group.create(Data);
  },

  updateGroup: async (id, Data) => {
    const { name, description, thumbnail, adminEmail, paymentStatus } = Data;
    return await Group.findByIdAndUpdate(
      groupidid,
      {
        name,
        description,
        thumbnail,
        adminEmail,
        paymentStatus,
      },
      { new: true },
    ); // new = true will return the updated document
  },

  addMember: async (...membersEmail) => {
    return await Group.findByIdAndUpdate(
      groupid,
      {
        $addToSet: { membersEmail: { $each: membersEmail } },
      },
      { new: true },
    );
  },

  removeMember: async (...membersEmail) => {},

  getGroupByEmail: async (email) => {
    return await Group.find({ membersEmail: email });
  },

  getGroupByStatus: async (id) => {},

  getAuditLogs: async (groupid) => {},
};
