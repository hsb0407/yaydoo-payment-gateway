# Servidor Principal

## Descripción
Punto de entrada de la aplicación. Configura Express con middleware de seguridad, rutas y manejo de errores.

## Código

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing (webhook route needs raw body, others need JSON)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Payment gateway running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

module.exports = app;
```

## Funcionalidades

- **Helmet**: Headers HTTP seguros (XSS, clickjacking, etc.)
- **CORS**: Control de acceso por origins
- **Body Parsing**: JSON para rutas normales, raw para webhooks
- **Logging**: Registra cada请求 con timestamp
