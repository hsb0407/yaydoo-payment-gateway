const { v4: uuidv4 } = require('uuid');
const yaydooService = require('../services/yaydoo.service');

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const { amount, currency, description, customerEmail, metadata } = req.body;

      const paymentIntent = await yaydooService.createPaymentIntent({
        amount,
        currency,
        description,
        reference: uuidv4(),
        metadata: {
          ...metadata,
          customerEmail,
          createdAt: new Date().toISOString(),
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount,
          currency,
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await yaydooService.getPaymentIntent(id);

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { paymentMethod } = req.body;

      const payment = await yaydooService.confirmPayment(id, paymentMethod);

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await yaydooService.cancelPayment(id);

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const refund = await yaydooService.refundPayment(id, amount);

      res.json({
        success: true,
        data: refund,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentMethods(req, res, next) {
    try {
      const methods = await yaydooService.getPaymentMethods();

      res.json({
        success: true,
        data: methods,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req, res, next) {
    try {
      const signature = req.headers['x-yaydoo-signature'];
      const payload = req.body;

      const isValid = yaydooService.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      const { type, data } = payload;

      switch (type) {
        case 'payment.completed':
          console.log('Payment completed:', data.id);
          // Update database, send confirmation email, etc.
          break;
        case 'payment.failed':
          console.log('Payment failed:', data.id);
          // Handle failed payment
          break;
        case 'payment.refunded':
          console.log('Payment refunded:', data.id);
          // Handle refund
          break;
        default:
          console.log('Unhandled webhook event:', type);
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
