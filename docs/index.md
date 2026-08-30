# Documentación - Pasarela de Pagos Yaydoo

## Índice

1. [Servidor Principal](server.md)
2. [Configuración](config.md)
3. [Variables de Entorno](env.md)
4. [Servicio Yaydoo](service.md)
5. [Controlador de Pagos](controller.md)
6. [Rutas](routes.md)
7. [Middleware de Autenticación](auth-middleware.md)
8. [Middleware de Validación](validation-middleware.md)
9. [Manejo de Errores](error-handler.md)

## Estructura del Proyecto

```
yaydoo-payment-gateway/
├── docs/
│   ├── index.md                 # Este archivo
│   ├── server.md                # Servidor principal
│   ├── config.md                # Configuración
│   ├── env.md                   # Variables de entorno
│   ├── service.md               # Servicio Yaydoo
│   ├── controller.md            # Controlador de pagos
│   ├── routes.md                # Rutas API
│   ├── auth-middleware.md       # Autenticación JWT
│   ├── validation-middleware.md # Validación
│   └── error-handler.md         # Manejo de errores
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── services/
├── examples/
│   └── usage.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar servidor
npm start
```

## Endpoints Disponibles

| Método | Ruta                         | Descripción         |
|--------|------------------------------|---------------------|
| POST   | `/api/payments/create`       | Crear pago          |
| GET    | `/api/payments/:id`          | Consultar pago      |
| POST   | `/api/payments/:id/confirm`  | Confirmar pago      |
| POST   | `/api/payments/:id/cancel`   | Cancelar pago       |
| POST   | `/api/payments/:id/refund`   | Reembolsar pago     |
| GET    | `/api/payments/methods/list` | Métodos de pago     |
| POST   | `/api/webhooks/yaydoo`       | Webhooks            |
| GET    | `/api/health`                | Estado del servidor |
