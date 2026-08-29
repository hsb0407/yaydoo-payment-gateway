const express = require('express');
const router = express.Router();
const paymentRoutes = require('./payment.routes');
const webhookRoutes = require('./webhook.routes');

router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
