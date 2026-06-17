const axios = require('axios');

const TOKEN = process.env.TOKEN;
const GAS_URL = process.env.GAS_URL;

const API_URL =
  'https://apimenyala.robuxindo.com/api/admin-orders?productType=VILOG&page=1&perPage=20&sortField=createdAt&sortOrder=desc&status=PENDING&paymentStatus=SUCCESS';

async function checkOrders() {
  try {
    console.log('Checking orders...');

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const orders = response.data?.data?.items || [];

    console.log(`Jumlah order: ${orders.length}`);

    for (const order of orders) {
      try {
        const result = await axios.post(GAS_URL, {
          orderNumber: order.orderNumber,
          username: order.username,
          robux: order.robux,
          totalAmount: order.totalAmount,
          customerEmail: order.customerEmail,
          createdAt: order.createdAt
        });

        console.log(
          `Terkirim: ${order.orderNumber}`,
          result.data
        );
      } catch (err) {
        console.error(
          `Gagal kirim ${order.orderNumber}`
        );
        console.error(
          err.response?.data || err.message
        );
      }
    }
  } catch (err) {
    console.error(
      'Gagal ambil order:'
    );
    console.error(
      err.response?.data || err.message
    );
    console.error(
      'Kemungkinan token sudah expired.'
    );
  }
}

checkOrders();