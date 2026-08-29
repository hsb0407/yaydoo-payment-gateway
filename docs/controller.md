# Controlador de Pagos

## Descripción
Maneja la lógica de negocio para procesar pagos. Valida entradas, llama al servicio de Yaydoo y retorna respuestas.

## Código

```javascript
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
          break;
        case 'payment.failed':
          console.log('Payment failed:', data.id);
          break;
        case 'payment.refunded':
          console.log('Payment refunded:', data.id);
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
```

## Endpoints

### POST /payments/create
Crea un nuevo intent de pago.

**Request Body:**
```json
{
  "amount": 100.50,
  "currency": "MXN",
  "description": "Compra de ejemplo",
  "customerEmail": "cliente@ejemplo.com",
  "metadata": {
    "orderId": "ORDER-123"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "pay_abc123",
    "status": "pending",
    "amount": 100.50,
    "currency": "MXN",
    "clientSecret": "secret_xyz789"
  }
}
```

### GET /payments/:id
Obtiene detalles de un pago existente.

### POST /payments/:id/confirm
Confirma un pago con método de pago.

**Request Body:**
```json
{
  "paymentMethod": {
    "type": "card",
    "token": "tok_test_123"
  }
}
```

### POST /payments/:id/cancel
Cancela un pago pendiente.

### POST /payments/:id/refund
Reembolsa un pago completado.

**Request Body (opcional):**
```json
{
  "amount": 50.00
}
```

### GET /payments/methods/list
Lista métodos de pago disponibles.
