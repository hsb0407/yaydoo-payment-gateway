const axios = require('axios');
const config = require('../config');

class YaydooService {
  constructor() {
    this.client = axios.create({
      baseURL: config.yaydoo.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.yaydoo.apiKey}`,
        'X-API-Secret': config.yaydoo.apiSecret,
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        const errorCode = error.response?.status || 500;
        throw new YaydooError(errorMessage, errorCode);
      }
    );
  }

  async createPaymentIntent(paymentData) {
    const { amount, currency, description, reference, metadata = {} } = paymentData;
    
    const response = await this.client.post('/checkout/payment-intent', {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      description,
      reference,
      metadata,
    });

    return response;
  }

  async getPaymentIntent(paymentIntentId) {
    const response = await this.client.get(`/checkout/payment/${paymentIntentId}`);
    return response;
  }

  async confirmPayment(paymentIntentId, paymentMethod) {
    const response = await this.client.post(`/checkout/payment/${paymentIntentId}/confirm`, {
      payment_method: paymentMethod,
    });
    return response;
  }

  async cancelPayment(paymentIntentId) {
    const response = await this.client.post(`/checkout/payment/${paymentIntentId}/cancel`);
    return response;
  }

  async refundPayment(paymentIntentId, amount) {
    const response = await this.client.post(`/checkout/payment/${paymentIntentId}/refund`, {
      amount: amount ? Math.round(amount * 100) : undefined,
    });
    return response;
  }

  async createInvoice(invoiceData) {
    const response = await this.client.post('/checkout/invoice', invoiceData);
    return response;
  }

  async getInvoice(invoiceId) {
    const response = await this.client.get(`/checkout/invoice/${invoiceId}`);
    return response;
  }

  async createAccountReceivable(receivableData) {
    const response = await this.client.post('/checkout/account-receivables', receivableData);
    return response;
  }

  async getPaymentMethods() {
    const response = await this.client.get('/checkout/payment-methods');
    return response;
  }

  verifyWebhookSignature(payload, signature) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', config.webhook.secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

class YaydooError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'YaydooError';
    this.statusCode = statusCode;
  }
}

module.exports = new YaydooService();
