import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import CheckoutService from '../Service/CheckoutService';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser?.id) {
      alert('You must be logged in to view your account.');
      navigate('/login');
      return;
    }

    setUser(currentUser);

    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
      const data = await CheckoutService.getOrdersByCustomer(currentUser.id, token);
      if (Array.isArray(data)) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-600 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Account</h1>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Order History</h2>

      {orders.length === 0 && (
        <p className="text-gray-600">You have no orders yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <p><span className="font-semibold">Order #:</span>{' '}{order.orderNumber}</p>
              <p>
                <span className="font-semibold">Date:</span>{' '}
                {order.orderDate? new Date(order.orderDate).toLocaleString(): 'N/A'}
              </p>
              <p><span className="font-semibold">Status:</span>{' '}{order.status}</p>
              <p><span className="font-semibold">Total:</span>{' '}${order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="mt-4">
              <Link to={`/account/orders/${order.orderId}`} state={{ order }}
                className="inline-block text-red-500 font-medium hover:underline"
              >View Details 
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;
