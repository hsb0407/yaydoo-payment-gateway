# Mock de la API de Yaydoo — Guía de pruebas

Este documento explica cómo probar el flujo completo de la pasarela de pagos sin necesidad de credenciales reales de Yaydoo, mediante un servidor **mock** local que simula la API de Yaydoo.

## ¿Por qué un mock?

La pasarela (`yaydoo-payment-gateway`) es un *proxy* hacia la API de Yaydoo. Sin credenciales reales falla con `ECONNREFUSED` porque intenta conectar a `api.yaydoo.com`. El mock replica esos endpoints en local para poder testear el flujo completo de forma aislada.

## Componentes

### 1. Mock server — `mock/yaydoo.mock.js`

Servidor Express en el puerto `4000` que simula la API de Yaydoo. Almacena los pagos en memoria (un `Map`) y replica los estados del ciclo de vida.

| Endpoint                                      | Comportamiento                                  |
|-----------------------------------------------|-------------------------------------------------|
| `POST /checkout/payment-intent`               | Crea un pago con estado `requires_confirmation` |
| `GET /checkout/payment/:id`                   | Devuelve el pago o `404` si no existe           |
| `POST /checkout/payment/:id/confirm`          | Cambia estado a `succeeded`                     |
| `POST /checkout/payment/:id/cancel`           | Cambia estado a `cancelled`                     |
| `POST /checkout/payment/:id/refund`           | Cambia estado a `refunded` y crea un reembolso  |
| `GET /checkout/payment-methods`               | Lista métodos (card, spei, oxxo, paypal)        |
| `POST /checkout/invoice` / `GET /invoice/:id` | Simula facturas                                 |
| `POST /checkout/account-receivables`          | Simula cuentas por cobrar                       |

### 2. Configuración — `.env`

El gateway lee su configuración de `.env`. Para usar el mock:

```env
YAYDOO_API_URL=http://localhost:4000
YAYDOO_API_KEY=test_key
YAYDOO_API_SECRET=test_secret
JWT_SECRET=dev_jwt_secret
```

## Requisitos

Todos estos componentes ya están corriendo en esta sesión:

- **Mock de Yaydoo**: puerto `4000`
- **Gateway**: puerto `3000` (relanzado para cargar el nuevo `.env`)

> **Importante:** el gateway debe reiniciarse después de crear/cambiar `.env` para que lo cargue (dotenv lo lee al arranque).

## Ejecución

### 1. Arrancar el mock

```bash
node mock/yaydoo.mock.js
# Yaydoo mock server running on http://localhost:4000/checkout
```

### 2. Arrancar el gateway

```bash
npm run dev   # o npm start
```

### 3. Generar un token JWT

Los endpoints requieren autenticación. Se genera firmado con `JWT_SECRET`:

```bash
node -e "require('dotenv').config(); console.log(require('jsonwebtoken').sign({sub:'test'}, process.env.JWT_SECRET, {expiresIn:'1h'}))"
```

## Probar el flujo completo con curl

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNzg3OTYwMTUyLCJleHAiOjE3ODc5NjM3NTJ9.uSe-6yODsyh2jf1tRI4lao5HPUUdLklwfsKE3EH1ZMY"

# 1. Crear pago
curl -s -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":100.5,"currency":"MXN","description":"Compra test","customerEmail":"cliente@ejemplo.com","metadata":{"orderId":"ORDER-123"}}'

# 2. Listar métodos de pago
curl -s http://localhost:3000/api/payments/methods/list -H "Authorization: Bearer $TOKEN"

# 3. Consultar pago (usa el id devuelto en el paso 1)
curl -s http://localhost:3000/api/payments/pi_XXXX -H "Authorization: Bearer $TOKEN"

# 4. Confirmar pago
curl -s -X POST http://localhost:3000/api/payments/pi_XXXX/confirm \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"paymentMethod":{"type":"card","token":"tok_test_123"}}'

# 5. Reembolsar
curl -s -X POST http://localhost:3000/api/payments/pi_XXXX/refund \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":50}'

# 6. Cancelar
curl -s -X POST http://localhost:3000/api/payments/pi_XXXX/cancel -H "Authorization: Bearer $TOKEN"

# 7. Salud
curl -s http://localhost:3000/api/health
```

## Verificación de resultados

Transiciones de estado simuladas por el mock:

| Operación      | Estado resultante           |
|----------------|-----------------------------|
| Crear          | `requires_confirmation`     |
| Confirmar      | `succeeded`                 |
| Reembolsar     | `refunded` (crea `rf_...`)  |
| Cancelar       | `cancelled`                 |

## Ejemplo de salida (lo verificado en esta sesión)

```
== Crear pago ==
{"success":true,"data":{"id":"pi_d4d8640d-...","status":"requires_confirmation","amount":100.5,"currency":"MXN","clientSecret":"cs_mock_pi_..."}}

== Listar métodos ==
{"success":true,"data":{"methods":[{"type":"card",...},{"type":"spei"},{"type":"oxxo"},{"type":"paypal"}]}}

== Consultar pago ==
{"success":true,"data":{"id":"pi_d4d8640d-...","status":"requires_confirmation","amount":10050,...}}

== Confirmar ==
{"success":true,"data":{"id":"pi_d4d8640d-...","status":"succeeded",...}}

== Reembolsar ==
{"success":true,"data":{"id":"rf_0c7fc7b1-...","status":"succeeded"}}

== Cancelar ==
{"success":true,"data":{"id":"pi_46fd235f-...","status":"cancelled",...}}
```

## Notas

- El mock guarda los pagos **en memoria**: desaparecen al reiniciar el proceso del mock.
- El `.env` actual apunta al mock. Para conectar a Yaydoo real, cambia `YAYDOO_API_URL` por `https://api.yaydoo.com` y pon tus credenciales reales.
- Este `.env` usa valores de desarrollo (`dev_jwt_secret`, `test_key`); en producción usa secretos reales.
