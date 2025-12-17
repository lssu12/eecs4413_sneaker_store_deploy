import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

function Home() {
  return <h2>Welcome to Sneaker Store</h2>;
}

function Sneakers() {
  return <h2>Sneakers Catalog (coming soon)</h2>;
}

function Cart() {
  return <h2>Your Cart (coming soon)</h2>;
}

function App() {
  return (
    <Router>
      <header>
        <h1>Sneaker Store</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/sneakers">Sneakers</Link> |{" "}
          <Link to="/cart">Cart</Link> |{" "}
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sneakers" element={<Sneakers />} />
          <Route path="/cart" element={<Cart />} />

          {/* admin routes (P4) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
