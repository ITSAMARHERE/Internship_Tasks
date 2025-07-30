const checkoutNodeSdk = require('@paypal/checkout-server-sdk');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new checkoutNodeSdk.core.SandboxEnvironment(clientId, clientSecret);
const client = new checkoutNodeSdk.core.PayPalHttpClient(environment);

module.exports = {
  client: client,
  orders: checkoutNodeSdk.orders
};