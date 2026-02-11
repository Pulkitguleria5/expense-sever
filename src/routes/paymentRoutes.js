const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorizeMiddleware = require('../middlewares/authorizeMiddleware');
const paymentsController = require('../controllers/paymentsController');

// Protect all routes
router.use(authMiddleware.protect);

// Create order
router.post(
  '/create-order',
  authorizeMiddleware('payment:create'),
  paymentsController.createOrder
);

// Verify payment
router.post(
  '/verify-order',
  authorizeMiddleware('payment:create'),
  paymentsController.verifyOrder
);

module.exports = router;
