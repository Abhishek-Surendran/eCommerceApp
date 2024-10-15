import axios from 'axios';


export const createOrder = async (req, res) => {
  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: req.body.amount,
        },
      },
    ],
  };

  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'PayPal Order Creation Failed', error: error.response.data });
  }
};


export const captureOrder = async (req, res) => {
  const { orderId } = req.params;

  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'PayPal Order Capture Failed', error: error.response.data });
  }
};


const getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');

  try {
    const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get PayPal access token');
  }
};
