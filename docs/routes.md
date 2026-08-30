# Rutas

## Descripción
Define las rutas de la API y las asocia a sus controladores.

## Código Principal (routes/index.js)

```javascript
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
```

## Rutas de Pagos (payment.routes.js)

```javascript
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
```

## Rutas de Webhooks (webhook.routes.js)

```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/yaydoo', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;
```

## Mapa de Endpoints

| Método | Ruta                         | Middleware               | Controlador       |
|--------|------------------------------|--------------------------|-------------------|
| POST   | `/api/payments/create`       | auth, validation         | createPayment     |
| GET    | `/api/payments/:id`          | auth                     | getPayment        |
| POST   | `/api/payments/:id/confirm`  | auth                     | confirmPayment    |
| POST   | `/api/payments/:id/cancel`   | auth                     | cancelPayment     |
| POST   | `/api/payments/:id/refund`   | auth, validation         | refundPayment     |
| GET    | `/api/payments/methods/list` | auth                     | getPaymentMethods |
| POST   | `/api/webhooks/yaydoo`       | raw body                 | handleWebhook     |
| GET    | `/api/health`                | -                        | health check      |
