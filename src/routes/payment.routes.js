const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');
const { validatePayment, validateRefund } = require('../middleware/validation');

router.post('/create', authenticate, validatePayment, paymentController.createPayment);
router.get('/:id', authenticate, paymentController.getPayment);
router.post('/:id/confirm', authenticate, paymentController.confirmPayment);
router.post('/:id/cancel', authenticate, paymentController.cancelPayment);
router.post('/:id/refund', authenticate, validateRefund, paymentController.refundPayment);
router.get('/methods/list', authenticate, paymentController.getPaymentMethods);

module.exports = router;
