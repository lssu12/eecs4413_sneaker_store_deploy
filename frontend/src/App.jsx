import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Home from './Pages/Home';
import Sneaker from './Pages/Sneaker';
import Cart from './Pages/Cart';
import Register from './Pages/Register';
import Account from './Pages/Account';
import AdminPage from './Pages/AdminPage';
import AdminCustomers from './Pages/AdminCustomers';
import AdminProducts from './Pages/AdminProducts';
import CartContextProvider from './Context/CartContext';
import SneakerContextProvider from './Context/SneakerContext';
import { AuthProvider } from './Context/AuthContext';
import Checkout from './Pages/Checkout';
import AdminOrders from './Pages/AdminOrders';
import OrderSummary from './Pages/OrderSummary';
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
							{/* Public Routes */}
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<LoginSignup />} />
							<Route path="/register" element={<Register />} />
							<Route path="/sneakers" element={<Sneaker />} />
							<Route path="/sneakers/:productId" element={<Product />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/order-summary/:id" element={<OrderSummary />} />
							<Route path="/account" element={<Account />} />
							<Route path="/account/orders/:orderId" element={<OrderSummary />} />

							{/* Checkout route */}
							<Route path="/checkout" element={<Checkout />} />
							{/* Private Routes */}
							<Route
								path="/account"
								element={
									<PrivateRoute>
										<Account />
									</PrivateRoute>
								}
							/>
							{/* Admin Routes */}
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
