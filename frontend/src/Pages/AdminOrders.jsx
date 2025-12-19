import React, { useState, useEffect, useMemo } from 'react';
import OrderService from '../Service/OrderService';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminOrder = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const incomingCustomerContext = location.state?.customerContext ?? null;

	const [customerContext, setCustomerContext] = useState(incomingCustomerContext);

	useEffect(() => {
		if (incomingCustomerContext) {
			setCustomerContext(incomingCustomerContext);
		}
	}, [incomingCustomerContext]);

	const searchDefaults = useMemo(() => {
		const params = new URLSearchParams(location.search);
		const getParam = (key) => params.get(key) || '';
		const queryCustomerId = getParam('customerId');
		const fallbackCustomerId =
			queryCustomerId || (incomingCustomerContext?.id ? String(incomingCustomerContext.id) : '');
		return {
			status: getParam('status'),
			customerId: fallbackCustomerId,
			productId: getParam('productId'),
			dateFrom: getParam('dateFrom'),
			dateTo: getParam('dateTo'),
		};
	}, [location.search, incomingCustomerContext]);

	const [orders, setOrders] = useState([]);
	const [filters, setFilters] = useState({
		status: '',
		customerId: '',
		productId: '',
		dateFrom: '',
		dateTo: '',
		...searchDefaults,
	});

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await OrderService.listOrders(buildParams(filters));
				const filteredByCustomer =
					filters.customerId
						? data.filter((order) => String(order.customer?.id) === filters.customerId)
						: data;
				setOrders(filteredByCustomer);
			} catch (err) {
				console.error('Failed to fetch orders', err);
			}
		};
		fetchOrders();
	}, [filters]);

	useEffect(() => {
		setFilters((prev) => {
			const changed = Object.keys(searchDefaults).some((key) => searchDefaults[key] !== prev[key]);
			return changed ? { ...prev, ...searchDefaults } : prev;
		});
	}, [searchDefaults]);

	useEffect(() => {
		if (!customerContext) {
			return;
		}
		if (!filters.customerId || String(customerContext.id) !== filters.customerId) {
			setCustomerContext(null);
		}
	}, [filters.customerId, customerContext]);

	const clearCustomerFilter = () => {
		setCustomerContext(null);
		setFilters((prev) => ({ ...prev, customerId: '' }));
		const params = new URLSearchParams(location.search);
		const hadQuery = params.has('customerId');
		if (hadQuery) {
			params.delete('customerId');
		}
		if (hadQuery || incomingCustomerContext) {
			const search = params.toString();
			navigate(
				{
					pathname: location.pathname,
					search: search ? `?${search}` : '',
				},
				{ replace: true, state: null }
			);
		}
	};

	const buildParams = (input) => {
		const params = {};
		if (input.status) params.status = input.status;
		if (input.customerId) params.customerId = input.customerId;
		if (input.productId) params.productId = input.productId;
		if (input.dateFrom) params.dateFrom = input.dateFrom;
		if (input.dateTo) params.dateTo = input.dateTo;
		return params;
	};

	// Tailwind classes
	const tableCellClass = "border border-brand-muted/70 px-4 py-2 text-sm";
	const inputClass = "border border-brand-muted px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent w-full";
	const buttonBaseClass = "text-white px-4 py-2 rounded-full hover:opacity-90 transition";
	const labelClass = "block mb-1 font-medium text-brand-secondary";

	return (
		<div className="p-6 bg-brand-surface min-h-screen text-brand-primary">
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
			<div className="flex gap-2">
				<button
					onClick={() => navigate('/adminCustomers')}
					className={`bg-brand-secondary ${buttonBaseClass} hover:bg-brand-primary`}
				>
					← Customers
				</button>
				<button
					onClick={() => navigate('/Admin')}
					className={`bg-brand-primary ${buttonBaseClass} hover:bg-brand-secondary`}
				>
					Admin Home
				</button>
			</div>
			<h2 className="text-2xl font-display font-semibold text-center flex-1">Order List</h2>
		</div>

		{filters.customerId && (
			<div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-brand-primary/5 border border-brand-primary/30 rounded-3xl px-4 py-3 text-sm">
				<div className="text-brand-primary">
					Viewing orders for customer #{filters.customerId}
					{customerContext && (
						<span>
							{' '}
							({customerContext.firstName} {customerContext.lastName})
						</span>
					)}
				</div>
				<button
					onClick={clearCustomerFilter}
					className={`bg-brand-secondary ${buttonBaseClass} hover:bg-brand-primary w-full sm:w-auto`}
				>
					Clear customer filter
				</button>
			</div>
		)}

		{/* Filters */}
		<div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
			<div>
				<label className={labelClass}>Status</label>
				<select
					value={filters.status}
					onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
					className={inputClass}
				>
					<option value="">All</option>
					<option value="PENDING">Pending</option>
					<option value="PAID">Paid</option>
					<option value="SHIPPED">Shipped</option>
					<option value="DELIVERED">Delivered</option>
					<option value="CANCELLED">Cancelled</option>
				</select>
			</div>
			<div>
				<label className={labelClass}>Customer ID</label>
				<input
					type="number"
					value={filters.customerId}
					onChange={(e) => setFilters((prev) => ({ ...prev, customerId: e.target.value }))}
					className={inputClass}
					placeholder="e.g. 5"
				/>
			</div>
			<div>
				<label className={labelClass}>Product ID</label>
				<input
					type="number"
					value={filters.productId}
					onChange={(e) => setFilters((prev) => ({ ...prev, productId: e.target.value }))}
					className={inputClass}
					placeholder="e.g. 10"
				/>
			</div>
			<div>
				<label className={labelClass}>Date From</label>
				<input
					type="date"
					value={filters.dateFrom}
					onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
					className={inputClass}
				/>
			</div>
			<div>
				<label className={labelClass}>Date To</label>
				<input
					type="date"
					value={filters.dateTo}
					onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
					className={inputClass}
				/>
			</div>
		</div>

			{/* Orders Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-brand-muted bg-white shadow-sm">
					<thead className="bg-brand-primary text-white">
						<tr>
							<th className={tableCellClass}>Order ID</th>
							<th className={tableCellClass}>Order Number</th>
							<th className={tableCellClass}>Customer ID</th>
							<th className={tableCellClass}>First Name</th>
							<th className={tableCellClass}>Last Name</th>
							<th className={tableCellClass}>Email</th>
							<th className={tableCellClass}>Phone</th>
							<th className={tableCellClass}>Product ID</th>
							<th className={tableCellClass}>Product Name</th>
							<th className={tableCellClass}>Brand</th>
							<th className={tableCellClass}>Size</th>
							<th className={tableCellClass}>Unit Price</th>
							<th className={tableCellClass}>Status</th>
							<th className={tableCellClass}>Total Amount</th>
							<th className={tableCellClass}>Order Date</th>
						</tr>
					</thead>
					<tbody>
						{orders.length === 0 && (
							<tr>
								<td colSpan={15} className={`${tableCellClass} text-center`}>
									No orders found
								</td>
							</tr>
						)}
						{orders.map((order) =>
							order.items.map((item) => (
								<tr key={`${order.id}-${item.id}`} className="hover:bg-brand-surface">
									<td className={tableCellClass}>{order.id}</td>
									<td className={tableCellClass}>{order.orderNumber}</td>
									<td className={tableCellClass}>{order.customer?.id}</td>
									<td className={tableCellClass}>{order.customer?.firstName}</td>
									<td className={tableCellClass}>{order.customer?.lastName}</td>
									<td className={tableCellClass}>{order.customer?.email}</td>
									<td className={tableCellClass}>{order.customer?.phoneNumber}</td>
									<td className={tableCellClass}>{item.product?.id}</td>
									<td className={tableCellClass}>{item.product?.name}</td>
									<td className={tableCellClass}>{item.product?.brand}</td>
									<td className={tableCellClass}>{item.size}</td>
									<td className={tableCellClass}>${item.unitPrice.toFixed(2)}</td>
									<td className={tableCellClass}>{order.status}</td>
									<td className={tableCellClass}>${order.totalAmount.toFixed(2)}</td>
									<td className={tableCellClass}>{new Date(order.orderDate).toLocaleString()}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminOrder;
