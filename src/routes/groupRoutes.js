const express = require("express");
const groupController = require("../controllers/groupcontroller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware.protect);
router.post("/create", groupController.create);
router.put("/update/:id", groupController.update);
router.put("/addMember/:id", groupController.addMember);
router.put("/removeMember/:id", groupController.removeMember);
router.get("/getGroupsByEmail", groupController.getGroupsByEmail);
router.get("/getGroupByStatus/:id", groupController.getGroupByStatus);
router.get("/getAuditLogs/:id", groupController.getAuditLogs);

module.exports = router;
