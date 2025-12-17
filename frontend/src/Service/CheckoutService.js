import axios from "axios";
import { BASE_URL, getHeader } from "../Util/util";

const CheckoutService = {
  getOrdersByCustomer: async (customerId, token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: getHeader(token),
        params: { customerId }, // query param matches your Spring backend
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching orders by customer:", err);
      return [];
    }
  },

  getOrderById: async (orderId, token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
        headers: getHeader(token),
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching order by ID:", err);
      return null;
    }
  },

  createOrder: async (checkoutData, token) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/checkout`, checkoutData, {
        headers: getHeader(token),
      });
      return res.data;
    } catch (err) {
      console.error("Error creating order:", err);
      return null;
    }
  },
};

export default CheckoutService;
