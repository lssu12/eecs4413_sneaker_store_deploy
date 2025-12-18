import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Util/util';

const OrderSummary = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


	const container = "p-8 max-w-3xl mx-auto bg-white border border-brand-muted rounded-3xl shadow-sm mt-10 text-brand-primary";
	const title = "text-3xl font-display font-semibold text-center mb-6";
	const infoBlock = "mb-4 space-y-1";
	const table = "w-full border border-brand-muted border-collapse";
	const thead = "bg-brand-primary text-white";
	const rowHover = "hover:bg-brand-surface";
	const th = "border border-brand-muted/70 px-4 py-2";
	const td = "border border-brand-muted/70 px-4 py-2";
	const textCenter = "text-center";
	const textRight = "text-right";
	const totalCell = "border border-brand-muted/70 px-4 py-2 text-right font-bold";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <p className="text-center mt-6">Loading order...</p>;
  }
  if (!order) {
    return <p className="text-center mt-6">No order found.</p>;
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className={container}>
      <h2 className={title}>Order Summary</h2>

      <div className={infoBlock}>
        <p><strong>Order #:</strong> {order.orderNumber}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      <table className={table}>
        <thead className={thead}>
          <tr>
            <th className={`${th} text-left`}>Product</th>
            <th className={`${th} ${textCenter}`}>Size</th>
            <th className={`${th} ${textCenter}`}>Quantity</th>
            <th className={`${th} ${textRight}`}>Unit Price</th>
            <th className={`${th} ${textRight}`}>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, idx) => (
            <tr key={item.product?.id || item.productId || idx} className={rowHover}>
              <td className={td}>{item.product?.name || `Product ID: ${item.productId}`}</td>
              <td className={`${td} ${textCenter}`}>{item.size || '-'}</td>
              <td className={`${td} ${textCenter}`}>{item.quantity || 0}</td>
              <td className={`${td} ${textRight}`}>${item.unitPrice?.toFixed(2) || '0.00'}</td>
              <td className={`${td} ${textRight}`}>
                ${((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="4" className={totalCell}>Total</td>
            <td className={totalCell}>${order.totalAmount?.toFixed(2) || '0.00'}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderSummary;
