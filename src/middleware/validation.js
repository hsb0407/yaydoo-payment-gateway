const validatePayment = (req, res, next) => {
  const { amount, currency, description } = req.body;
  const errors = [];

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (!currency || typeof currency !== 'string') {
    errors.push('Currency is required');
  } else if (!/^[A-Z]{3}$/.test(currency)) {
    errors.push('Currency must be a valid 3-letter ISO code');
  }

  if (!description || typeof description !== 'string') {
    errors.push('Description is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateRefund = (req, res, next) => {
  const { amount } = req.body;

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    return res.status(400).json({ error: 'Refund amount must be a positive number' });
  }

  next();
};

module.exports = { validatePayment, validateRefund };
