import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';

import Home from './Pages/Home';
import Sneaker from './Pages/Sneaker';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Register from './Pages/Register';
import Checkout from './Pages/Checkout';
import OrderSummary from './Pages/OrderSummary';

// Customer pages
import Profile from './Pages/Profile';
import Orders from './Pages/Orders';

// Admin pages
import AdminPage from './Pages/AdminPage';
import AdminCustomers from './Pages/AdminCustomers';
import AdminProducts from './Pages/AdminProducts';
import AdminOrders from './Pages/AdminOrders';

// Contexts
import CartContextProvider from './Context/CartContext';
import SneakerContextProvider from './Context/SneakerContext';
import { AuthProvider } from './Context/AuthContext';

// Route guards
import PrivateRoute from './Components/PrivateRoute';
import AdminRoute from './Components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <SneakerContextProvider>
        <CartContextProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>

              {/* ---------- Public Routes ---------- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginSignup />} />
              <Route path="/register" element={<Register />} />
              <Route path="/sneakers" element={<Sneaker />} />
              <Route path="/sneakers/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* ---------- Private Customer Routes ---------- */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders/:orderId"
                element={
                  <PrivateRoute>
                    <OrderSummary />
                  </PrivateRoute>
                }
              />

              {/* ---------- Admin Routes ---------- */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/adminCustomers"
                element={
                  <AdminRoute>
                    <AdminCustomers />
                  </AdminRoute>
                }
              />

              <Route
                path="/adminOrders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orders/:orderId"
                element={
                  <AdminRoute>
                    <OrderSummary />
                  </AdminRoute>
                }
              />

              <Route
                path="/adminProducts"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />

            </Routes>
          </BrowserRouter>
        </CartContextProvider>
      </SneakerContextProvider>
    </AuthProvider>
  );
}

export default App;
