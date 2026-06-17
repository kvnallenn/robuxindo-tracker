const axios = require('axios');

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const GAS_URL = process.env.GAS_URL;

const API_URL =
  'https://apimenyala.robuxindo.com/api/admin-orders?productType=VILOG&page=1&perPage=20&sortField=createdAt&sortOrder=desc&status=PENDING&paymentStatus=SUCCESS';

async function checkOrders() {
  try {
    console.log('Login...');

    const login = await axios.post(
      'https://apimenyala.robuxindo.com/api/admin-auth/login',
      {
        email: EMAIL,
        password: PASSWORD
      }
    );

    const token =
      login.data.data.accessToken;

    console.log('Login berhasil');

    const response = await axios.get(
      API_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const orders =
      response.data?.data?.items || [];

    console.log(
      `Jumlah order ditemukan: ${orders.length}`
    );

    for (const order of orders) {
      try {
        await axios.post(GAS_URL, {
          orderNumber: order.orderNumber,
          username: order.username,
          robux: order.robux,
          totalAmount: order.totalAmount,
          customerEmail:
            order.customerEmail,
          createdAt: order.createdAt
        });

        console.log(
          `Berhasil kirim ${order.orderNumber}`
        );
      } catch (err) {
        console.error(
          `Gagal kirim ${order.orderNumber}`
        );

        console.error(
          err.response?.data ||
          err.message
        );
      }
    }
  } catch (err) {
    console.error('ERROR');

    console.error(
      err.response?.data ||
      err.message
    );
  }
}

checkOrders();