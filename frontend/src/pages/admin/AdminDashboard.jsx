import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
      </ul>
    </div>
  );
}
