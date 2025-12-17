import { useLocation } from 'react-router-dom';

const OrderSummary = () => {
	const { state } = useLocation();
	const { order } = state || {};

	// Shared Tailwind classes
	const containerClass = "p-6 max-w-3xl mx-auto bg-gray-50 min-h-screen";
	const titleClass = "text-2xl font-bold text-center mb-6";
	const infoBlockClass = "mb-4 space-y-1";
	const tableClass = "w-full border border-gray-300 border-collapse";
	const theadClass = "bg-black text-white";
	const rowHoverClass = "hover:bg-gray-100";
	const thBaseClass = "border px-4 py-2";
	const tdBaseClass = "border px-4 py-2";
	const textCenter = "text-center";
	const textRight = "text-right";
	const totalCellClass = "border px-4 py-2 text-right font-bold";

	if (!order) return <p className="text-center mt-6">No order found.</p>;

	return (
		<div className={containerClass}>
			<h2 className={titleClass}>Order Summary</h2>

			<div className={infoBlockClass}>
				<p><strong>Order #:</strong> {order.orderNumber}</p>
				<p><strong>Status:</strong> {order.status}</p>
			</div>

			<table className={tableClass}>
				<thead className={theadClass}>
					<tr>
						<th className={`${thBaseClass} text-left`}>Product</th>
						<th className={`${thBaseClass} ${textCenter}`}>Size</th>
						<th className={`${thBaseClass} ${textCenter}`}>Quantity</th>
						<th className={`${thBaseClass} ${textRight}`}>Unit Price</th>
						<th className={`${thBaseClass} ${textRight}`}>Subtotal</th>
					</tr>
				</thead>

				<tbody>
					{order.items.map((item, index) => (
						<tr key={item.product?.id || item.productId || index} className={rowHoverClass}>
							<td className={tdBaseClass}>
								{item.product?.name || `Product ID: ${item.productId}`}
							</td>
							<td className={`${tdBaseClass} ${textCenter}`}>{item.size || '-'}</td>
							<td className={`${tdBaseClass} ${textCenter}`}>{item.quantity}</td>
							<td className={`${tdBaseClass} ${textRight}`}>
								${item.unitPrice?.toFixed(2) || '0.00'}
							</td>
							<td className={`${tdBaseClass} ${textRight}`}>
								${((item.unitPrice || 0) * item.quantity).toFixed(2)}
							</td>
						</tr>
					))}
				</tbody>

				<tfoot>
					<tr>
						<td colSpan="4" className={totalCellClass}>Total</td>
						<td className={totalCellClass}>${order.totalAmount.toFixed(2)}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
};

export default OrderSummary;
