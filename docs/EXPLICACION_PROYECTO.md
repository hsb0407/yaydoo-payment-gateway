# Yaydoo Payment Gateway — Explicación del proyecto

Pasarela de pagos B2B en Node.js/Express que actúa como intermediario entre los clientes y la API de **Yaydoo** (plataforma de cobros en Latinoamérica).

## Arquitectura (capas)

- **`src/server.js`** — Punto de entrada: configura Express con seguridad (helmet, CORS), parsing de JSON, logging y arranca el servidor.
- **`src/config/index.js`** — Centraliza la configuración desde variables de entorno (`.env`).
- **`src/routes/`** — Define las rutas HTTP (`/api/payments/*`, `/api/webhooks/*`, `/api/health`).
- **`src/controllers/payment.controller.js`** — Maneja las peticiones, delega en el servicio y arma las respuestas.
- **`src/services/yaydoo.service.js`** — Cliente HTTP (axios) que se comunica con la API real de Yaydoo.
- **`src/middleware/`** — `auth` (JWT), `validation` y `errorHandler`.

## Funcionalidad principal

El gateway expone el ciclo de vida del pago:

1. **Crear pago** (`POST /api/payments/create`) — crea un *payment intent* en Yaydoo (convierte montos a centavos).
2. **Consultar** (`GET /:id`), **confirmar** (`/:id/confirm`), **cancelar** (`/:id/cancel`) y **reembolsar** (`/:id/refund`).
3. **Métodos de pago** (`GET /methods/list`).
4. **Webhooks** (`POST /api/webhooks/yaydoo`) — recibe eventos asíncronos de Yaydoo (pagado, fallido, reembolsado), verificando firma HMAC.

## Seguridad

- Endpoints de pagos protegidos con **JWT Bearer**.
- Webhooks verificados con **firma HMAC-SHA256**.
- Errores tipificados (`YaydooError`, `ValidationError`, etc.) y respuestas genéricas en producción.

## Ejecución

```bash
cp .env.example .env   # configurar claves de Yaydoo
npm run dev            # desarrollo
npm start              # producción
```

## Notas

Un detalle a notar: el servicio no usa ninguna base de datos — es un *proxy stateless* hacia Yaydoo (la persistencia ocurre del lado de Yaydoo).
