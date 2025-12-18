import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import axios from 'axios';
import { BASE_URL } from '../Util/util';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

	// Shared Tailwind classes
	const containerClass = "max-w-4xl mx-auto px-4 py-10 text-brand-primary";
	const cardClass = "border border-brand-muted p-5 rounded-3xl shadow-sm bg-white";
	const titleClass = "text-3xl font-display font-semibold mb-6";
	const infoClass = "mb-2";
	const linkClass = "inline-block mt-2 text-brand-accent hover:underline";

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser?.id) {
      alert('You must be logged in to view your orders.');
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/orders?customerId=${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <p className="text-center mt-6">Loading orders...</p>;}

  if (!orders.length) {
    return <p className="text-center mt-6">You have no orders yet.</p>;
  }

  return (
    <div className={containerClass}>
      <h1 className={titleClass}>My Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className={cardClass}>
            <p className={infoClass}><strong>Order #:</strong> {order.orderNumber}</p>
            <p className={infoClass}><strong>Status:</strong> {order.status}</p>
            <p className={infoClass}><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            <Link to={`/orders/${order.id}`} className={linkClass}>
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
