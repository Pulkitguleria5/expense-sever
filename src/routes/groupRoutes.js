const express = require("express");
const groupController = require("../controllers/groupcontroller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware.protect);
router.post("/create", groupController.create);
router.put("/update", groupController.update);
router.put("/members/add", groupController.addMember);
router.put("/members/remove", groupController.removeMember);
router.get("/my-groups", groupController.getGroupsByUser);
router.get("/status", groupController.getGroupByStatus);
router.get("/:id/audit", groupController.getAuditLogs);

module.exports = router;
