# Middleware de Autenticación

## Descripción
Maneja la autenticación JWT para proteger endpoints.

## Código

```javascript
const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

module.exports = { authenticate, generateToken };
```

## Uso

### Proteger un endpoint
```javascript
router.get('/protected', authenticate, controller.method);
```

### Generar token
```javascript
const { generateToken } = require('./middleware/auth');
const token = generateToken({ userId: 123, email: 'hugo.santiago.b@gmail.com' });
```

## Headers requeridos
```
Authorization: Bearer <token>
```

## Errores
- 401: Token no proporcionado
- 401: Token inválido o expirado
