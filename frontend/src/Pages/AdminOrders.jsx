import React, { useState, useEffect } from 'react';
import OrderService from '../Service/OrderService';
import { useNavigate } from 'react-router-dom';

const AdminOrder = () => {
	const navigate = useNavigate();

	const [orders, setOrders] = useState([]);
	const [customerFilter, setCustomerFilter] = useState('');
	const [productFilter, setProductFilter] = useState('');
	const [dateFilter, setDateFilter] = useState('');

	const fetchOrders = async () => {
		try {
			const data = await OrderService.listOrders();
			console.log('Fetched orders:', data);
			setOrders(data);
		} catch (err) {
			console.error('Failed to fetch orders', err);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const filteredOrders = orders.filter((order) => {
		const customerText = `${order.customer?.firstName} ${order.customer?.lastName} ${order.customer?.email}`.toLowerCase();
		const customerMatch = customerText.includes(customerFilter.toLowerCase());

		const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
		const dateMatch = dateFilter ? orderDate === dateFilter : true;

		const productMatch = order.items.some((item) => {
			const productText = `${item.product?.name} ${item.product?.brand}`.toLowerCase();
			return productText.includes(productFilter.toLowerCase());
		});

		return customerMatch && productMatch && dateMatch;
	});

	// Tailwind classes
	const tableCellClass = "border px-4 py-2";
	const inputClass = "border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full";
	const buttonBaseClass = "text-white px-4 py-2 rounded hover:opacity-90 transition";

	return (
		<div className="p-6">
			<div className="relative mb-4">
				<button
					onClick={() => navigate('/Admin')}
					className={`bg-blue-500 ${buttonBaseClass} hover:bg-blue-800 absolute left-0`}
				>
					Back to Admin Page
				</button>
				<h2 className="text-2xl font-bold text-black text-center">Order List</h2>
			</div>

			{/* Filters */}
			<div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label className="block mb-1 font-medium">Customer Name/Email</label>
					<input
						type="text"
						placeholder="Filter by customer name or email"
						value={customerFilter}
						onChange={(e) => setCustomerFilter(e.target.value)}
						className={inputClass}
					/>
				</div>
				<div>
					<label className="block mb-1 font-medium">Product Name/Brand</label>
					<input
						type="text"
						placeholder="Filter by product name or brand"
						value={productFilter}
						onChange={(e) => setProductFilter(e.target.value)}
						className={inputClass}
					/>
				</div>
				<div>
					<label className="block mb-1 font-medium">Date</label>
					<input
						type="date"
						value={dateFilter}
						onChange={(e) => setDateFilter(e.target.value)}
						className={inputClass}
					/>
				</div>
			</div>

			{/* Orders Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-300">
					<thead className="bg-black text-white">
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
						{filteredOrders.length === 0 && (
							<tr>
								<td colSpan={15} className={`${tableCellClass} text-center`}>
									No orders found
								</td>
							</tr>
						)}
						{filteredOrders.map((order) =>
							order.items.map((item) => (
								<tr key={`${order.id}-${item.id}`} className="hover:bg-gray-50">
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
