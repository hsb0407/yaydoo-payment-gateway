# ¿Dónde y cómo se paga? ¿Yaydoo pide el número de tarjeta?

## ¿Dónde se paga?

El dinero no se procesa en esta aplicación. Esta pasarela es un **proxy stateless** que delega todo el cobro a la **API de Yaydoo** (`https://api.yaydoo.com`).

| Capa | Rol |
|------|-----|
| **Cliente** | llama a la pasarela (`/api/payments/*`) |
| **Esta app (gateway)** | crea/consulta/confirma/cancela/reembolsa el *payment intent* contra Yaydoo |
| **Yaydoo** | procesa el cobro real y persiste los datos |

Endpoints reales que consume el servicio (`src/services/yaydoo.service.js`):

- `POST /checkout/payment-intent` — crea el cobro (convierte montos a centavos)
- `GET /checkout/payment/:id` — consulta
- `POST /checkout/payment/:id/confirm` — confirma
- `POST /checkout/payment/:id/cancel` — cancela
- `POST /checkout/payment/:id/refund` — reembolsa

## ¿Yaydoo pide el número de tarjeta?

**No en este código.** La pasarela nunca toca ni procesa el número de tarjeta.

### Crear pago

`sandbox/services/yaydoo.service.js:26` — solo envía estos datos:

```javascript
const { amount, currency, description, reference, metadata = {} } = paymentData;

const response = await this.client.post('/checkout/payment-intent', {
  amount: Math.round(amount * 100), // Convert to cents
  currency: currency.toUpperCase(),
  description,
  reference,
  metadata,
});
```

No se incluye ningún dato de tarjeta (PAN, CVV, expiración).

### Confirmar pago

`src/services/yaydoo.service.js:45` — solo manda el **tipo** de método de pago, no el número:

```javascript
async confirmPayment(paymentIntentId, paymentMethod) {
  const response = await this.client.post(`/checkout/payment/${paymentIntentId}/confirm`, {
    payment_method: paymentMethod,
  });
  return response;
}
```

### El mock confirma lo mismo

`mock/yaydoo.mock.js:23` — la confirmación solo guarda `payment_method`:

```javascript
app.post('/checkout/payment/:id/confirm', (req, res) => {
  const payment = findPayment(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'succeeded';
  payment.payment_method = req.body.payment_method;
  res.json(payment);
});
```

## ¿Entonces dónde captura la tarjeta el cliente?

En un flujo real de Yaydoo, el número de tarjeta lo captura el **frontend del cliente** (una página/checkout protegida), no el backend:

1. El backend crea el *payment intent* y recibe un `client_secret` (`payment.controller.js:28`).
2. El frontend usa ese `client_secret` para renderizar un formulario/canvas seguro de Yaydoo donde el cliente ingresa su tarjeta.
3. El frontend genera un **token** del método de pago (sin almacenar/transmitir el PAN por tu servidor).
4. Con ese token se confirma el pago.

Resultado: el número de tarjeta nunca pasa por tu backend ni por esta pasarela, lo que reduce el alcance de PCI-DSS.

## Resumen

- **La tarjeta la pide el frontend del cliente**, dentro del checkout seguro de Yaydoo.
- **Esta pasarela backend nunca recibe ni procesa el número de tarjeta**.
- La pasarela solo maneja montos, moneda, referencia, metadata y el *id* del método de pago.
