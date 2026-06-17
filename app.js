const axios = require('axios');

const TOKEN = process.env.TOKEN;
const GAS_URL = process.env.GAS_URL;

const API_URL =
  'https://apimenyala.robuxindo.com/api/admin-orders?productType=VILOG&page=1&perPage=20&sortField=createdAt&sortOrder=desc&status=PENDING&paymentStatus=SUCCESS';

async function checkOrders() {
  try {
    console.log('Checking orders...');

    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const items =
      res.data?.data?.items || [];

    for (const order of items) {
      await axios.post(
        GAS_URL,
        {
          id: order.id,
          orderNumber:
            order.orderNumber,
          username:
            order.username,
          robux:
            order.robux,
          totalAmount:
            order.totalAmount,
          customerEmail:
            order.customerEmail,
          customerPhone:
            order.customerPhone,
          status:
            order.status,
          paymentStatus:
            order.paymentStatus,
          createdAt:
            order.createdAt
        }
      );

      console.log(
        'Sent:',
        order.orderNumber
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}

checkOrders();