import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';

const OrderSuccess = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const order = location.state?.order ?? null;
	const isLoggedIn = AuthService.isAuthenticated();

	const formatDate = (value) => {
		if (!value) return 'Pending';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return 'Pending';
		return date.toLocaleString();
	};

	const estimatedDelivery = useMemo(() => {
		if (!order?.placedAt) return null;
		const date = new Date(order.placedAt);
		if (Number.isNaN(date.getTime())) return null;
		date.setDate(date.getDate() + 5);
		return date.toDateString();
	}, [order?.placedAt]);

	const orderNumber = order?.orderNumber || 'Pending';
	const totalItems = order?.totalItems ?? '-';
	const totalAmount = Number.isFinite(order?.totalAmount)
		? `$${order.totalAmount.toFixed(2)}`
		: '$0.00';

	const goToOrders = () => {
		if (isLoggedIn) {
			navigate('/orders');
		} else {
			navigate('/login', { state: { from: '/orders' } });
		}
	};

	const continueShopping = () => navigate('/sneakers');
	const goHome = () => navigate('/');

	return (
		<div className="bg-brand-surface min-h-[70vh] flex items-center justify-center px-4 text-brand-primary">
			<div className="bg-white max-w-3xl w-full rounded-3xl shadow-md border border-brand-muted px-8 py-10">
				<div className="flex flex-col items-center text-center gap-3">
					<div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-3xl mb-2">
						✓
					</div>
					<h1 className="text-3xl font-display font-semibold">Your order is on the way!</h1>
					<p className="text-brand-secondary max-w-xl">
						{order
							? `Order #${orderNumber} has been received. We're packing your sneakers and will email ${order?.customerEmail || 'you'} a confirmation shortly.`
							: 'Thank you for your purchase. We will email you a confirmation shortly.'}
					</p>
				</div>

				{order ? (
					<div className="grid gap-4 mt-8">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<DetailCard label="Order number" value={`#${orderNumber}`} />
							<DetailCard label="Placed on" value={formatDate(order.placedAt)} />
							<DetailCard label="Items" value={totalItems} />
							<DetailCard label="Total paid" value={totalAmount} />
							<DetailCard label="Status" value={order.status || 'Processing'} />
							<DetailCard label="Estimated delivery" value={estimatedDelivery || '3-5 business days'} />
						</div>
						<div className="bg-brand-primary/5 p-4 rounded-2xl text-sm text-brand-secondary">
							We'll notify you when the package ships. Need to make a change? Visit your orders page or contact support within the next 30 minutes.
						</div>
					</div>
				) : (
					<div className="mt-8 bg-brand-primary/5 p-4 rounded-2xl text-sm text-brand-secondary text-center">
						We couldn't load the latest order details. Head to your orders page to review your purchases.
					</div>
				)}

				<div className="mt-10 flex flex-col md:flex-row gap-4">
					<button
						onClick={goToOrders}
						className="flex-1 bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-secondary transition"
					>
						{isLoggedIn ? 'View my orders' : 'Sign in to view orders'}
					</button>
					<button
						onClick={continueShopping}
						className="flex-1 bg-white border border-brand-muted text-brand-primary px-6 py-3 rounded-full hover:border-brand-primary"
					>
						Continue shopping
					</button>
					<button
						onClick={goHome}
						className="flex-1 bg-brand-muted text-brand-primary px-6 py-3 rounded-full hover:bg-brand-accent/60"
					>
						Back to home
					</button>
				</div>
			</div>
		</div>
	);
};

const DetailCard = ({ label, value }) => (
	<div className="border border-brand-muted rounded-2xl p-4 text-left">
		<p className="text-xs uppercase tracking-wide text-brand-secondary">{label}</p>
		<p className="text-lg font-semibold text-brand-primary mt-1">{value}</p>
	</div>
);

export default OrderSuccess;
