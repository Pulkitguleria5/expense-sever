const groupDao = require("../dao/groupDao");
const groupController = {
  create: async (req, res) => {
    try {
      const user = req.user;
      const { name, description, thumbnail, membersEmail } =
        req.body;
      let allMembers = [user.email];
      if (membersEmail && Array.isArray(membersEmail)) {
        allMembers = [...new Set([...membersEmail, ...allMembers])];
      }

      const newGroup = await groupDao.createGroup({
        name,
        description,
        thumbnail,
        adminEmail : user.email,
        allMembers,
        paymentStatus: {
          amount: 0,
          currency: "INR",
          date: Date.now(),
          isPaid: false,
        },
      });
      res.status(200).json({
        message: "Group created successfully",
        groupid: newGroup._id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
       
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, thumbnail, adminEmail, paymentStatus } =
        req.body;
      const updatedGroup = await groupDao.updateGroup(id, {
        name,
        description,
        thumbnail,
        adminEmail,
        paymentStatus,
      });
      res.status(200).json({
        message: "Group updated successfully",
        group: updatedGroup,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  addMember: async (req, res) => {
    try {
      const { id } = req.params;
      const { membersEmail } = req.body;
      const updatedGroup = await groupDao.addMember(id, ...membersEmail);
      res.status(200).json({
        message: "Member added successfully",
        group: updatedGroup,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  removeMember: async (req, res) => {
    try {
      const { id } = req.params;
      const { membersEmail } = req.body;
      const updatedGroup = await groupDao.removeMember(id, ...membersEmail);
      res.status(200).json({
        message: "Member removed successfully",
        group: updatedGroup,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },


  getGroupsByEmail: async (req, res) => {
    try {
      const user = req.user;
      const groups = await groupDao.getGroupByEmail(user.email);
      res.status(200).json({
        message: "Groups retrieved successfully",
        groups: groups,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },



  getGroupByStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const group = await groupDao.getGroupByStatus(id);
      res.status(200).json({
        message: "Group retrieved successfully",
        group: group,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getAuditLogs: async (req, res) => {
    try {
      const { id } = req.params;  
      const auditLogs = await groupDao.getAuditLogs(id);
      res.status(200).json({  
        message: "Audit logs retrieved successfully",
        auditLogs: auditLogs,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};
module.exports = groupController;
