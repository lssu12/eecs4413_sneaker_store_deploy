import axios from "axios";

import {getHeader} from "../Util/util"


const BASE_URL = import.meta.env.VITE_BASE_URL;


const CartService = {

  getCart(customerId) {
    return axios.get(`${BASE_URL}/api/cart/${customerId}`);
  },

 
  addItem(customerId, cartItemRequest) {
    return axios.post(
      `${BASE_URL}/api/cart/${customerId}/items`,
      cartItemRequest
    );
  },


  updateItem(customerId, itemId, cartItemRequest) {
    return axios.put(
      `${BASE_URL}/api/cart/${customerId}/items/${itemId}`,
      cartItemRequest
    );
  },

  
  removeItem(customerId, itemId) {
    return axios.delete(
      `${BASE_URL}/api/cart/${customerId}/items/${itemId}`
    );
  },
};

export default CartService;
