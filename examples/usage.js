const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function exampleUsage() {
  try {
    // 1. Create a payment
    console.log('1. Creating payment...');
    const createResponse = await axios.post(`${API_BASE_URL}/payments/create`, {
      amount: 400.00,
      currency: 'MXN',
      description: 'Pago de Mantenimiento',
      customerEmail: 'hugo.santiago.b@gmail.com',
      metadata: {
        orderId: 'ORDER-123',
      },
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
      },
    });

    const { id: paymentId, clientSecret } = createResponse.data.data;
    console.log('Payment created:', paymentId);

    // 2. Get payment details
    console.log('\n2. Getting payment details...');
    const getResponse = await axios.get(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
      },
    });
    console.log('Payment details:', getResponse.data.data);

    // 3. Confirm payment (with payment method)
    console.log('\n3. Confirming payment...');
    const confirmResponse = await axios.post(`${API_BASE_URL}/payments/${paymentId}/confirm`, {
      paymentMethod: {
        type: 'card',
        token: 'tok_test_123',
      },
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
      },
    });
    console.log('Payment confirmed:', confirmResponse.data.data);

    // 4. Get available payment methods
    console.log('\n4. Getting payment methods...');
    const methodsResponse = await axios.get(`${API_BASE_URL}/payments/methods/list`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
      },
    });
    console.log('Available methods:', methodsResponse.data.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run example
exampleUsage();
