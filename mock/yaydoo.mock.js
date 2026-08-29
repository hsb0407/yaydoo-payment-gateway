const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PAYMENTS = new Map();

const paymentFromIntent = (intent) => ({
  id: intent.id,
  status: 'requires_confirmation',
  amount: intent.amount,
  currency: intent.currency,
  description: intent.description,
  reference: intent.reference,
  metadata: intent.metadata || {},
  client_secret: `cs_mock_${intent.id}`,
  created_at: new Date().toISOString(),
});

app.post('/checkout/payment-intent', (req, res) => {
  const intent = {
    id: `pi_${uuidv4()}`,
    ...req.body,
  };
  const payment = paymentFromIntent(intent);
  PAYMENTS.set(payment.id, payment);
  res.status(201).json(payment);
});

const findPayment = (id) => {
  if (id.startsWith('pi_') && PAYMENTS.has(id)) return PAYMENTS.get(id);
  return null;
};

app.get('/checkout/payment/:id', (req, res) => {
  const payment = findPayment(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
});

app.post('/checkout/payment/:id/confirm', (req, res) => {
  const payment = findPayment(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'succeeded';
  payment.payment_method = req.body.payment_method;
  res.json(payment);
});

app.post('/checkout/payment/:id/cancel', (req, res) => {
  const payment = findPayment(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'cancelled';
  res.json(payment);
});

app.post('/checkout/payment/:id/refund', (req, res) => {
  const payment = findPayment(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'refunded';
  res.json({ id: `rf_${uuidv4()}`, payment: payment.id, amount: req.body.amount, status: 'succeeded' });
});

app.get('/checkout/payment-methods', (req, res) => {
  res.json({
    methods: [
      { type: 'card', brands: ['visa', 'mastercard', 'amex'] },
      { type: 'spei' },
      { type: 'oxxo' },
      { type: 'paypal' },
    ],
  });
});

app.post('/checkout/invoice', (req, res) => {
  res.status(201).json({ id: `inv_${uuidv4()}`, ...req.body, status: 'created' });
});

app.get('/checkout/invoice/:id', (req, res) => {
  res.json({ id: req.params.id, status: 'created' });
});

app.post('/checkout/account-receivables', (req, res) => {
  res.status(201).json({ id: `ar_${uuidv4()}`, ...req.body, status: 'created' });
});

app.listen(4000, () => {
  console.log('Yaydoo mock server running on http://localhost:4000/checkout');
});
