import axios from "axios";

export default class ApiServices {
  static BASE_URL = "http://localhost:8080";

  static getHeader() {
    // Try to access the token
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // -------------AUTH & USER PI-----------------
  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/register`,
      registration
    );
    return response.data;
  }

  static async loginUser(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/login`,
      loginDetails
    );
    return response.data;
  }

  // -----------PRODUCT ENDPOINT-------------
  static async listProducts() {
    const response = await axios.get(`${this.BASE_URL}/api/admin/products`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async addProduct(productData) {
    const response = await axios.post(
      `${this.BASE_URL}/api/admin/products`,
      productData,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async updateProduct(productId, productData) {
    const response = await axios.put(
      `${this.BASE_URL}/api/admin/products/${productId}`,
      productData,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async deleteProduct(productId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/admin/products/${productId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // --------------CUSTOMER--------------------
  static async listCustomers() {
    const response = await axios.get(`${this.BASE_URL}/api/admin/customers`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getCustomerById(customerId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/admin/customers/${customerId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async updateCustomer(customerId, customerData) {
    const response = await axios.put(
      `${this.BASE_URL}/api/admin/customers/${customerId}`,
      customerData,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async deleteCustomer(customerId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/admin/customers/${customerId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // -------------------ORDER ----------------------
  static async listOrders(status) {
    const params = {};
    if (status) {
      params.status = status;
    }
    const response = await axios.get(`${this.BASE_URL}/api/admin/orders`, {
      headers: this.getHeader(),
      params: params,
    });
    return response.data;
  }

  static async getOrderById(orderId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/admin/orders/${orderId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async updateOrderStatus(orderId, status) {
    const response = await axios.put(
      `${this.BASE_URL}/api/admin/orders/${orderId}/status`,
      { status: status },
      { headers: this.getHeader() }
    );
    return response.data;
  }

  //  ------------------AUTHENTICATION CHECKER ----------------
  static logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Remove the role from localStorage as well
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if there's a token
  }

  static isAdmin() {
    const role = localStorage.getItem("role"); // Get role from localStorage
    return role === "ADMIN"; // Check if role is "ADMIN"
  }
}
