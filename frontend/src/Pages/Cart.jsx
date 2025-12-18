import React from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';

const Cart = () => {
	const { cartProductList, addToCart, decreaseItem, deleteItem, getTotalItems } = useCart();
	const navigate = useNavigate();
	const userLoggedIn = AuthService.isAuthenticated();

	const totalPrice = cartProductList.reduce(
		(sum, item) => sum + parseFloat(item.price) * item.quantity,
		0
	);

	const handleCheckout = () => {
		if (!userLoggedIn) {
			navigate('/login', { state: { from: '/checkout' } });
		} else {
			navigate('/checkout');
		}
	};

	if (cartProductList.length === 0) {
		return <p className="p-6 text-center text-gray-600">Your cart is empty</p>;
	}

	// Tailwind class variables
	const tableCell = "border px-4 py-2";
	const actionButton = "text-white px-3 py-1 rounded transition";
	const addButton = `bg-blue-500 hover:bg-blue-700 ${actionButton}`;
	const removeButton = `bg-red-500 hover:bg-red-700 ${actionButton}`;

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h2 className="text-2xl font-bold text-black mb-4 text-center">
				Your Cart ({getTotalItems()} items)
			</h2>

			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-300">
					<thead className="bg-black text-white">
						<tr>
							<th className={tableCell}>Name</th>
							<th className={tableCell}>Size</th>
							<th className={tableCell}>Price</th>
							<th className={tableCell}>Quantity</th>
							<th className={tableCell}>Total</th>
							<th className={tableCell}>Actions</th>
						</tr>
					</thead>

					<tbody>
						{cartProductList.map((item) => {
							const cartKey = `${item.id}-${item.size}`;
							return (
								<tr key={cartKey} className="hover:bg-gray-100">
									<td className={tableCell}>{item.name}</td>
									<td className={tableCell}>{item.size}</td>
									<td className={tableCell}>${parseFloat(item.price).toFixed(2)}</td>
									<td className={tableCell}>{item.quantity}</td>
									<td className={tableCell}>
										${(parseFloat(item.price) * item.quantity).toFixed(2)}
									</td>
									<td className={`${tableCell} flex gap-2`}>
										<button onClick={() => addToCart(cartKey)} className={addButton}>
											+
										</button>
										<button onClick={() => decreaseItem(cartKey)} className={addButton}>
											-
										</button>
										<button onClick={() => deleteItem(cartKey)} className={removeButton}>
											Remove
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>

					<tfoot>
						<tr className="bg-gray-200 font-semibold">
							<td colSpan="4" className={`${tableCell} text-right`}>
								Total Price:
							</td>
							<td colSpan="2" className={tableCell}>
								${totalPrice.toFixed(2)}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div className="flex justify-end mt-6">
				<button
					onClick={handleCheckout}
					className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
				>
					Checkout
				</button>
			</div>
		</div>
	);
};

export default Cart;
