const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeMiddleware = require('../middlewares/authorizeMiddleware');
const express = require('express');
const router = express.Router();


router.use(authMiddleware.protect);

router.post('/create', authorizeMiddleware('group:create'), expenseController.create);
router.put('/update', authorizeMiddleware('group:update'), expenseController.update);
router.get('/group/:groupId', authorizeMiddleware('group:view'), expenseController.getByGroupId);
router.get('/summary/:groupId', authorizeMiddleware('group:view'), expenseController.getSummary);
router.post('/settle', authorizeMiddleware('group:update'), expenseController.settleGroup);
router.get('/:expenseId', authorizeMiddleware('group:view'), expenseController.getByExpenseId);
router.delete('/:expenseId', authorizeMiddleware('group:delete'), expenseController.delete);
router.patch('/split/update', authorizeMiddleware('group:update'), expenseController.updateSplitAmount);
router.patch('/split/add', authorizeMiddleware('group:update'), expenseController.addSplitUser);

module.exports = router;

