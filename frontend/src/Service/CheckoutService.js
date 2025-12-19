import axios from "axios";
import { getHeader } from "../Util/util";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const CheckoutService = {
  getOrdersByCustomer: async (customerId, token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: getHeader(token),
        params: { customerId }, 
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
