import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import CheckoutService from '../Service/CheckoutService';

const Checkout = () => {
	const { cartProductList, getTotalItems, clearCart } = useCart();
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [billing, setBilling] = useState({ firstName: '', lastName: '', address: '', city: '', zip: '' });
	const [shipping, setShipping] = useState({ firstName: '', lastName: '', address: '', city: '', zip: '' });
	const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvc: '' });
	const [checkoutCompleted, setCheckoutCompleted] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (!cartProductList.length && !checkoutCompleted) {
			navigate('/sneakers');
			return;
		}

		const currentUser = AuthService.getCurrentUser();
		if (!currentUser?.id) {
			alert('You must be logged in to checkout.');
			navigate('/login');
			return;
		}

		setUser(currentUser);
		setBilling(currentUser.billing || { firstName: '', lastName: '', address: '', city: '', zip: '' });
		setShipping(currentUser.shipping || { firstName: '', lastName: '', address: '', city: '', zip: '' });
	}, [navigate, cartProductList, checkoutCompleted]);

	const totalPrice = cartProductList.reduce(
		(sum, item) => sum + parseFloat(item.price) * item.quantity,
		0
	);

	const handleConfirmOrder = async () => {
		if (!user?.id) {
			alert('You must be logged in to checkout.');
			return;
		}

		if (!payment.cardNumber || !payment.expiry || !payment.cvc) {
			alert('Please enter all payment information.');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			alert('You must be logged in to place an order.');
			return;
		}

		const checkoutData = {
			customerId: user.id,
			items: cartProductList.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
				size: item.size || null,
			})),
			shippingAddress: `${shipping.address}, ${shipping.city}, ${shipping.zip}`,
			billingAddress: `${billing.address}, ${billing.city}, ${billing.zip}`,
		};

		try {
			const response = await CheckoutService.createOrder(checkoutData, token);

			if (response.status === 'ERROR' || response.message?.toLowerCase().includes('failed')) {
				alert(response.message || 'Credit Card Authorization Failed.');
				return;
			}

			setCheckoutCompleted(true);
			alert(`Order ${response.orderNumber} successfully added!`);


			setTimeout(() => {
				clearCart();
			}, 0);
		} catch (err) {
			alert('Failed to place order. Please try again.');
			setErrorMessage('Failed to place order.');
		}
	};


	const container = 'max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-12'; 
	const title = "text-2xl font-bold text-center mb-6";
	const section = "mb-6";
	const sectionTitle = "text-lg font-semibold mb-2";
	const inputClass = 'border p-2 w-full max-w-md mx-auto rounded block';
	const grid2 = "grid grid-cols-1 md:grid-cols-2 gap-4";
	const grid3 = "grid grid-cols-1 md:grid-cols-3 gap-4";
	const alertError = "text-red-600 mb-4";
	const alertSuccess = "bg-green-100 text-green-800 p-3 rounded mb-4";
	const table = "min-w-full border border-gray-300";
	const tableHeader = "bg-black text-white";
	const tableCell = "border px-4 py-2";
	const hoverRow = "hover:bg-gray-100";
	const summary = "mt-4 font-semibold";
	const buttonBlue = "bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-800 transition";
	const buttonGray = "bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-800 transition";
	const buttonGroup = "flex gap-4";

	return (
		<div className={container}>
			<h2 className={title}>Checkout</h2>

			{errorMessage && <div className={alertError}>{errorMessage}</div>}
			{successMessage && <div className={alertSuccess}>{successMessage}</div>}
			{/* Billing */}
			<section className={section}>
				<h3 className={sectionTitle}>Billing Information</h3>
				<div className={grid2}>
					<div>
						<label className="block text-sm font-medium mb-1">First Name</label>
						<input
							className={inputClass}
							value={billing.firstName}
							onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Last Name</label>
						<input
							className={inputClass}
							value={billing.lastName}
							onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Address</label>
						<input
							className={inputClass}
							value={billing.address}
							onChange={(e) => setBilling({ ...billing, address: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">City</label>
						<input
							className={inputClass}
							value={billing.city}
							onChange={(e) => setBilling({ ...billing, city: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Postal Code</label>
						<input
							className={inputClass}
							value={billing.zip}
							onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
						/>
					</div>
				</div>
			</section>

			{/* Shipping */}
			<section className={section}>
				<h3 className={sectionTitle}>Shipping Information</h3>
				<div className={grid2}>
					<div>
						<label className="block text-sm font-medium mb-1">First Name</label>
						<input
							className={inputClass}
							value={shipping.firstName}
							onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Last Name</label>
						<input
							className={inputClass}
							value={shipping.lastName}
							onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Address</label>
						<input
							className={inputClass}
							value={shipping.address}
							onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">City</label>
						<input
							className={inputClass}
							value={shipping.city}
							onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Postal Code</label>
						<input
							className={inputClass}
							value={shipping.zip}
							onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
						/>
					</div>
				</div>
			</section>

			{/* Payment */}
			<section className={section}>
				<h3 className={sectionTitle}>Payment Information</h3>
				<div className={grid3}>
					<div>
						<label className="block text-sm font-medium mb-1">Card Number</label>
						<input
							className={inputClass}
							value={payment.cardNumber}
							onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Expiry</label>
						<input
							className={inputClass}
							value={payment.expiry}
							onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">CVC</label>
						<input
							className={inputClass}
							value={payment.cvc}
							onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
						/>
					</div>
				</div>
			</section>


			{/* Order Summary */}
			<section className={section}>
				<h3 className={sectionTitle}>Order Summary</h3>
				<table className={table}>
					<thead className={tableHeader}>
						<tr>
							<th className={tableCell}>Product</th>
							<th className={tableCell}>Size</th>
							<th className={tableCell}>Qty</th>
							<th className={tableCell}>Price</th>
							<th className={tableCell}>Subtotal</th>
						</tr>
					</thead>
					<tbody>
						{cartProductList.map((item) => (
							<tr key={`${item.id}-${item.size}`} className={hoverRow}>
								<td className={tableCell}>{item.name}</td>
								<td className={tableCell}>{item.size || '-'}</td>
								<td className={tableCell}>{item.quantity}</td>
								<td className={tableCell}>${item.price.toFixed(2)}</td>
								<td className={tableCell}>${(item.price * item.quantity).toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className={summary}>
					<p>Total Items: {getTotalItems()}</p>
					<p>Total Price: ${totalPrice.toFixed(2)}</p>
				</div>
			</section>

			<div className={buttonGroup}>
				<button onClick={handleConfirmOrder} className={buttonBlue}>
					Confirm Order
				</button>
				<button onClick={() => navigate('/cart')} className={buttonGray}>
					Back to Cart
				</button>
			</div>
		</div>
	);
};

export default Checkout;
