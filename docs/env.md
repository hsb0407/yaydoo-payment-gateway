# Variables de Entorno

## Descripción
Archivo de configuración para variables de entorno. Copia a `.env` y completa los valores.

## Código (.env.example)

```bash
PORT=3000
NODE_ENV=development

# Yaydoo API Configuration
YAYDOO_API_URL=https://api.yaydoo.com
YAYDOO_API_KEY=your_api_key_here
YAYDOO_API_SECRET=your_api_secret_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## Configuración

1. Copia el archivo:
```bash
cp .env.example .env
```

2. Edita `.env` con tus valores reales

3. **NUNCA** subas `.env` a repositorios (está en `.gitignore`)

## Variables

| Variable          | Requerido | Descripción                                          |
|----------         |-----------|-------------                                         |
| PORT              | No        | Puerto del servidor (default: 3000)                  |
| NODE_ENV          | No        | development o production                             |
| YAYDOO_API_URL    | No        | URL base de Yaydoo (default: https://api.yaydoo.com) |
| YAYDOO_API_KEY    | Sí        | API Key de Yaydoo                                    |
| YAYDOO_API_SECRET | Sí        | API Secret de Yaydoo                                 |
| JWT_SECRET        | Sí        | Secreto para firmar tokens JWT                       |
| JWT_EXPIRES_IN    | No        | Tiempo de expiración (default: 24h)                  |
| WEBHOOK_SECRET    | Sí        | Secreto para verificar webhooks                      |
| ALLOWED_ORIGINS   | No        | Origins CORS separados por coma                      |


