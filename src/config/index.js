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
