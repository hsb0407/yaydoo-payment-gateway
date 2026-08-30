# Yaydoo Payment Gateway

Pasarela de pagos integrada con la API de Yaydoo para procesar transacciones B2B en Latinoamérica.

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:
- `YAYDOO_API_KEY`: Tu API key de Yaydoo
- `YAYDOO_API_SECRET`: Tu API secret de Yaydoo
- `JWT_SECRET`: Secreto para tokens JWT
- `WEBHOOK_SECRET`: Secreto para verificar webhooks

## Uso

### Iniciar servidor

```bash
npm start
```

### Desarrollo

```bash
npm run dev
```

## API Endpoints

### Pagos

| Método | Ruta                         | Descripción               |
|--------|------------------------------|---------------------------|
| POST   | `/api/payments/create`       | Crear nuevo pago          |
| GET    | `/api/payments/:id`          | Obtener detalles del pago |
| POST   | `/api/payments/:id/confirm`  | Confirmar pago            |
| POST   | `/api/payments/:id/cancel`   | Cancelar pago             |
| POST   | `/api/payments/:id/refund`   | Reembolsar pago           |
| GET    | `/api/payments/methods/list` | Listar métodos de pago    |

### Webhooks

| Método | Ruta                   | Descripción               |
|--------|------------------------|---------------------------|
| POST   | `/api/webhooks/yaydoo` | Recibir eventos de Yaydoo |

### Salud

| Método | Ruta          | Descripción                   |
|--------|---------------|-------------------------------|
| GET    | `/api/health` | Verificar estado del servidor |

## Ejemplo de Uso

```javascript
const axios = require('axios');

// Crear un pago
const response = await axios.post('http://localhost:3000/api/payments/create', {
  amount: 100.50,
  currency: 'MXN',
  description: 'Compra de ejemplo',
  customerEmail: 'cliente@ejemplo.com',
}, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
  },
});

console.log(response.data);
```

## Estructura del Proyecto

```
yaydoo-payment-gateway/
├── src/
│   ├── config/         # Configuración
│   ├── controllers/    # Controladores
│   ├── middleware/     # Middleware (auth, validation, errors)
│   ├── routes/         # Rutas API
│   └── services/       # Servicios (Yaydoo API)
├── examples/           # Ejemplos de uso
├── .env.example        # Variables de entorno ejemplo
└── package.json
```

## Licencia

ISC
