import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import CheckoutService from '../Service/CheckoutService';

const PAYMENT_GUARD_KEY = 'checkoutPaymentGuard';
const MAX_PAYMENT_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 2 * 60 * 1000;
const DEFAULT_PAYMENT_GUARD = { attempts: 0, blockedUntil: null };

const loadPaymentGuard = () => {
	if (typeof window === 'undefined') {
		return { ...DEFAULT_PAYMENT_GUARD };
	}
	try {
		const raw = window.localStorage.getItem(PAYMENT_GUARD_KEY);
		if (!raw) {
			return { ...DEFAULT_PAYMENT_GUARD };
		}
		const parsed = JSON.parse(raw);
		return {
			attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
			blockedUntil: typeof parsed.blockedUntil === 'number' ? parsed.blockedUntil : null,
		};
	} catch (err) {
		console.error('Failed to parse payment guard state', err);
		return { ...DEFAULT_PAYMENT_GUARD };
	}
};

const Checkout = () => {
	const { cartProductList, getTotalItems, clearCart, refreshProducts } = useCart();
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [billing, setBilling] = useState({ firstName: '', lastName: '', address: '', city: '', zip: '' });
	const [shipping, setShipping] = useState({ firstName: '', lastName: '', address: '', city: '', zip: '' });
	const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvc: '' });
	const [useSavedInfo, setUseSavedInfo] = useState(true);
	const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
	const [checkoutCompleted, setCheckoutCompleted] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [paymentGuard, setPaymentGuard] = useState(() => loadPaymentGuard());
	const [blockCountdown, setBlockCountdown] = useState(0);
	const [savePaymentInfo, setSavePaymentInfo] = useState(true);
	const paymentAttempts = paymentGuard.attempts || 0;
	const blockedUntil = paymentGuard.blockedUntil;
	const attemptsRemaining = Math.max(MAX_PAYMENT_ATTEMPTS - paymentAttempts, 0);
	const isPaymentBlocked = Boolean(
		blockedUntil && (blockCountdown > 0 || blockedUntil > Date.now())
	);

	useEffect(() => {
		if (!cartProductList.length && !checkoutCompleted) {
			navigate('/sneakers');
			return;
		}

		const currentUser = AuthService.getCurrentUser();
		if (currentUser?.id) {
			setUser(currentUser);
			setBilling({
				firstName: currentUser.firstName || '',
				lastName: currentUser.lastName || '',
				address: currentUser.billingAddressLine1 || currentUser.addressLine1 || '',
				city: currentUser.billingCity || currentUser.city || '',
				zip: currentUser.billingPostalCode || currentUser.postalCode || '',
			});
			setShipping({
				firstName: currentUser.firstName || '',
				lastName: currentUser.lastName || '',
				address: currentUser.addressLine1 || currentUser.billingAddressLine1 || '',
				city: currentUser.city || currentUser.billingCity || '',
				zip: currentUser.postalCode || currentUser.billingPostalCode || '',
			});
			setPayment({
				cardNumber: currentUser.creditCardNumber || '',
				expiry: currentUser.creditCardExpiry || '',
				cvc: currentUser.creditCardCvv || '',
			});
		} else {
			setUseSavedInfo(false);
			setPayment({ cardNumber: '', expiry: '', cvc: '' });
		}
	}, [navigate, cartProductList, checkoutCompleted]);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		try {
			window.localStorage.setItem(PAYMENT_GUARD_KEY, JSON.stringify(paymentGuard));
		} catch (err) {
			console.error('Failed to persist payment guard state', err);
		}
	}, [paymentGuard]);

	useEffect(() => {
		if (!blockedUntil) {
			setBlockCountdown(0);
			return;
		}
		const updateCountdown = () => {
			const remaining = blockedUntil - Date.now();
			if (remaining <= 0) {
				setPaymentGuard({ attempts: 0, blockedUntil: null });
				setBlockCountdown(0);
				return;
			}
			setBlockCountdown(Math.ceil(remaining / 1000));
		};
		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [blockedUntil]);

	const totalPrice = cartProductList.reduce(
		(sum, item) => sum + parseFloat(item.price) * item.quantity,
		0
	);

	const handleGuestChange = (e) => {
		const { name, value } = e.target;
		setGuestInfo((prev) => ({ ...prev, [name]: value }));
	};

	const stripDigits = (value = '') => value.replace(/\D/g, '');

	const isCardNumberValid = (value = '') => stripDigits(value).length === 16;

	const parseExpiryParts = (raw = '') => {
		const trimmed = raw.trim();
		if (!trimmed) {
			return null;
		}
		const match = trimmed.match(/^(\d{1,2})(?:[\/\-]?(\d{2}))$/);
		if (!match) {
			return null;
		}
		const month = Number(match[1]);
		const year = Number(match[2]);
		if (!Number.isInteger(month) || !Number.isInteger(year)) {
			return null;
		}
		return { month, year };
	};

	const isExpiryValid = (value = '') => {
		const parts = parseExpiryParts(value);
		if (!parts) {
			return false;
		}
		const { month, year } = parts;
		if (month < 1 || month > 12) {
			return false;
		}
		return year >= 0 && year < 40;
	};

	const showError = (message) => {
		setErrorMessage(message);
		setSuccessMessage('');
	};

	const showSuccess = (message) => {
		setSuccessMessage(message);
		setErrorMessage('');
	};

	const resetPaymentGuard = () => {
		setPaymentGuard({ attempts: 0, blockedUntil: null });
		setBlockCountdown(0);
	};

	const recordPaymentFailure = () => {
		let willBlock = false;
		setPaymentGuard((prev) => {
			const nextAttempts = (prev.attempts || 0) + 1;
			if (nextAttempts >= MAX_PAYMENT_ATTEMPTS) {
				willBlock = true;
				return {
					attempts: nextAttempts,
					blockedUntil: Date.now() + BLOCK_DURATION_MS,
				};
			}
			return { ...prev, attempts: nextAttempts };
		});
		if (willBlock) {
			setBlockCountdown(Math.ceil(BLOCK_DURATION_MS / 1000));
		}
	};

	const handleConfirmOrder = async () => {
		setErrorMessage('');
		setSuccessMessage('');
		if (isPaymentBlocked) {
			const waitSeconds = blockCountdown || (blockedUntil ? Math.max(Math.ceil((blockedUntil - Date.now()) / 1000), 0) : 0);
			showError(`Too many failed payment attempts. Please wait ${waitSeconds || 120} seconds before trying again.`);
			return;
		}
		let customerId = user?.id;
		if (!customerId) {
			if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.password || guestInfo.password !== guestInfo.confirmPassword) {
				showError('Please fill in guest name, email, password and confirm password (must match).');
				return;
			}
			try {
				const response = await AuthService.registerUser({
					firstName: guestInfo.firstName,
					lastName: guestInfo.lastName,
					email: guestInfo.email,
					password: guestInfo.password,
					addressLine1: shipping.address || billing.address,
					city: shipping.city || '',
					postalCode: shipping.zip || '',
					billingAddressLine1: billing.address || '',
					billingCity: billing.city || '',
					billingPostalCode: billing.zip || '',
				});
				if (!response.success) {
					showError(response.message || 'Unable to register new account for checkout.');
					return;
				}
				customerId = response.customerId;
				AuthService.persistSession(response);
				const hydratedUser = AuthService.getCurrentUser();
				setUser(hydratedUser || { id: response.customerId, email: guestInfo.email });
			}
			catch (err) {
				showError('Unable to register account. Please try again.');
				return;
			}
		}

		if (!payment.cardNumber || !payment.expiry || !payment.cvc) {
			showError('Please enter all payment information.');
			recordPaymentFailure();
			return;
		}

		if (!isCardNumberValid(payment.cardNumber)) {
			showError('Card number must contain exactly 16 digits.');
			recordPaymentFailure();
			return;
		}

		if (!isExpiryValid(payment.expiry)) {
			showError('Expiry must include a valid month (1-12) and a year under 40 (use MM/YY).');
			recordPaymentFailure();
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			showError('You must be logged in to place an order.');
			return;
		}

		const cardHolderName = `${billing.firstName || user?.firstName || ''} ${billing.lastName || user?.lastName || ''}`.trim();
		const checkoutData = {
			customerId,
			items: cartProductList.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
				size: item.size || null,
			})),
			shippingAddress: `${shipping.address}, ${shipping.city}, ${shipping.zip}`,
			billingAddress: `${billing.address}, ${billing.city}, ${billing.zip}`,
			useSavedInfo,
			paymentMethod: payment.cardNumber,
			paymentToken: 'approve',
			cardHolder: cardHolderName,
			cardNumber: payment.cardNumber,
			cardExpiry: payment.expiry,
			cardCvv: payment.cvc,
			savePaymentInfo,
		};

		try {
			const response = await CheckoutService.createOrder(checkoutData, token);

			if (!response) {
				showError('Failed to place order. Please try again.');
				recordPaymentFailure();
				return;
			}

			if (response.status === 'ERROR' || response.message?.toLowerCase().includes('failed')) {
				showError(response.message || 'Credit Card Authorization Failed.');
				recordPaymentFailure();
				return;
			}

			const totalItemsOrdered = getTotalItems();
			const orderDetails = {
				orderNumber: response?.orderNumber || 'Pending',
				orderId: response?.id || null,
				totalAmount: typeof response?.totalAmount === 'number' ? response.totalAmount : totalPrice,
				totalItems: totalItemsOrdered,
				status: response?.status || 'PENDING',
				placedAt: response?.orderDate || new Date().toISOString(),
				customerEmail: user?.email || guestInfo.email || '',
			};

			resetPaymentGuard();
			setCheckoutCompleted(true);
			showSuccess(`Order ${orderDetails.orderNumber} successfully placed! Redirecting to confirmation...`);
			clearCart();
			if (typeof refreshProducts === 'function') {
				refreshProducts();
			}
			if (savePaymentInfo) {
				const nextUser = AuthService.updateCachedUser({
					creditCardHolder: cardHolderName,
					creditCardNumber: payment.cardNumber,
					creditCardExpiry: payment.expiry,
					creditCardCvv: payment.cvc,
				});
				if (nextUser) {
					setUser(nextUser);
					setPayment({
						cardNumber: nextUser.creditCardNumber || '',
						expiry: nextUser.creditCardExpiry || '',
						cvc: nextUser.creditCardCvv || '',
					});
				}
			}
			navigate('/order-success', { state: { order: orderDetails } });
		} catch (err) {
			showError('Failed to place order. Please try again.');
			recordPaymentFailure();
		}
	};


	const container = 'max-w-3xl mx-auto p-8 bg-white border border-brand-muted rounded-3xl shadow-sm mt-12 text-brand-primary'; 
	const title = "text-3xl font-display font-semibold text-center mb-6";
	const section = "mb-6 border-b border-brand-muted pb-6 last:border-none";
	const sectionTitle = "text-lg font-semibold mb-4";
	const inputClass = 'border border-brand-muted focus:border-brand-accent focus:ring-brand-accent focus:ring-1 p-2 w-full rounded-md bg-white disabled:bg-brand-muted/40 disabled:text-brand-secondary disabled:cursor-not-allowed';
	const grid2 = "grid grid-cols-1 md:grid-cols-2 gap-4";
	const grid3 = "grid grid-cols-1 md:grid-cols-3 gap-4";
	const alertError = "bg-red-100 text-red-800 border border-red-200 p-3 rounded mb-4";
	const alertSuccess = "bg-green-100 text-green-800 border border-green-200 p-3 rounded mb-4";
	const table = "min-w-full border border-brand-muted";
	const tableHeader = "bg-brand-primary text-white";
	const tableCell = "border border-brand-muted/60 px-4 py-2";
	const hoverRow = "hover:bg-brand-surface";
	const summary = "mt-4 font-semibold";
	const buttonBlue = "bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-brand-secondary transition";
	const buttonGray = "bg-brand-muted text-brand-primary px-6 py-2 rounded-full hover:bg-brand-accent/70 transition";
	const buttonGroup = "flex gap-4";
	const disabledButton = "opacity-60 cursor-not-allowed";

	const addressDisabled = useSavedInfo && !!user;

	return (
		<div className={container}>
			<h2 className={title}>Checkout</h2>

			{errorMessage && <div className={alertError}>{errorMessage}</div>}
			{successMessage && <div className={alertSuccess}>{successMessage}</div>}

			{!user && (
				<section className={section}>
					<h3 className={sectionTitle}>Guest Checkout</h3>
					<div className={grid2}>
						<input name="firstName" placeholder="First Name" value={guestInfo.firstName} onChange={handleGuestChange} className={inputClass} />
						<input name="lastName" placeholder="Last Name" value={guestInfo.lastName} onChange={handleGuestChange} className={inputClass} />
						<input name="email" type="email" placeholder="Email" value={guestInfo.email} onChange={handleGuestChange} className={inputClass} />
						<input name="password" type="password" placeholder="Password" value={guestInfo.password} onChange={handleGuestChange} className={inputClass} />
						<input name="confirmPassword" type="password" placeholder="Confirm Password" value={guestInfo.confirmPassword} onChange={handleGuestChange} className={inputClass} />
					</div>
				</section>
			)}

			{user && (
				<div className="flex items-center gap-2 mb-6">
					<input type="checkbox" checked={useSavedInfo} onChange={(e) => setUseSavedInfo(e.target.checked)} />
					<span>Use saved profile billing and shipping information</span>
				</div>
			)}

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
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Last Name</label>
						<input
							className={inputClass}
							value={billing.lastName}
							onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Address</label>
						<input
							className={inputClass}
							value={billing.address}
							onChange={(e) => setBilling({ ...billing, address: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">City</label>
						<input
							className={inputClass}
							value={billing.city}
							onChange={(e) => setBilling({ ...billing, city: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Postal Code</label>
						<input
							className={inputClass}
							value={billing.zip}
							onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
							disabled={addressDisabled}
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
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Last Name</label>
						<input
							className={inputClass}
							value={shipping.lastName}
							onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Address</label>
						<input
							className={inputClass}
							value={shipping.address}
							onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">City</label>
						<input
							className={inputClass}
							value={shipping.city}
							onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Postal Code</label>
						<input
							className={inputClass}
							value={shipping.zip}
							onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
							disabled={addressDisabled}
						/>
					</div>
				</div>
			</section>

			{/* Payment */}
			<section className={section}>
				<h3 className={sectionTitle}>Payment Information</h3>
				{isPaymentBlocked && (
					<div className="mb-4 bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-2xl px-4 py-3 text-sm">
						Too many failed payment attempts. Please wait {blockCountdown || (blockedUntil ? Math.max(Math.ceil((blockedUntil - Date.now()) / 1000), 0) : 0)} seconds before trying again.
					</div>
				)}
				{!isPaymentBlocked && paymentAttempts > 0 && (
					<p className="mb-4 text-xs text-brand-secondary">
						Payment attempts remaining: {attemptsRemaining} of {MAX_PAYMENT_ATTEMPTS}.
					</p>
				)}
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
				<div className="mt-4 flex items-center gap-2 text-sm text-brand-secondary">
					<input
						type="checkbox"
						checked={savePaymentInfo}
						onChange={(e) => setSavePaymentInfo(e.target.checked)}
						className="rounded border-brand-muted"
					/>
					<span>Save payment information for future purchases</span>
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
				<button
					onClick={handleConfirmOrder}
					className={`${buttonBlue} ${isPaymentBlocked ? disabledButton : ''}`}
					disabled={isPaymentBlocked}
				>
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
