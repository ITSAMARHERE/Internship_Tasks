// controllers/shop/order-controller.js
const paypalSdk = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/product");
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;


    const request = new paypalSdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    const paypalItems = cartItems.map(item => ({
      name: item.title,
      sku: item.productId,
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2)
      },
      quantity: item.quantity
    }));

    const itemTotal = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0).toFixed(2);

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: uuidv4(),
        amount: {
          currency_code: "USD",
          value: totalAmount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: itemTotal
            }
          }
        },
        items: paypalItems
      }],
      application_context: {
        brand_name: "Your Store Name",
        shipping_preference: "NO_SHIPPING",  
        user_action: "PAY_NOW",
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      }
    });

    
    const paypalOrder = await paypalSdk.client.execute(request);
    
   
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: paypalOrder.result.id, 
      payerId,
    });

    await newlyCreatedOrder.save();

   
    const approvalURL = paypalOrder.result.links.find(
      link => link.rel === "approve"
    ).href;

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating PayPal order",
      error: error.message
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};