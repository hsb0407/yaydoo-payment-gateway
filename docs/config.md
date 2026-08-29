# Configuración

## Descripción
Centraliza todas las variables de entorno y configuraciones del proyecto.

## Código

```javascript
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  yaydoo: {
    apiUrl: process.env.YAYDOO_API_URL || 'https://api.yaydoo.com',
    apiKey: process.env.YAYDOO_API_KEY,
    apiSecret: process.env.YAYDOO_API_SECRET,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
};
```

## Variables de Entorno

| Variable            | Descripción                             | Default                |
|---------------------|-----------------------------------------|------------------------|
| `PORT`              | Puerto del servidor                     | 3000                   |
| `NODE_ENV`          | Entorno (development/production)        | development            |
| `YAYDOO_API_URL`    | URL base de Yaydoo API                  | https://api.yaydoo.com |
| `YAYDOO_API_KEY`    | API Key de Yaydoo                       | -                      |
| `YAYDOO_API_SECRET` | API Secret de Yaydoo                    | -                      |
| `JWT_SECRET`        | Secreto para firmar JWT                 | -                      |
| `JWT_EXPIRES_IN`    | Tiempo de expiración JWT                | 24h                    |
| `WEBHOOK_SECRET`    | Secreto para webhooks                   | -                      |
| `ALLOWED_ORIGINS`   | Origins permitidos (separados por coma) | http://localhost:3000  |
