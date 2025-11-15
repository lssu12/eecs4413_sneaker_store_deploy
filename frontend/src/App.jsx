import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

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
          <Link to="/cart">Cart</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sneakers" element={<Sneakers />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
