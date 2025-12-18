import React, { useState, useEffect } from 'react';
import CustomerService from '../Service/AdminCustomerService';
import { useNavigate } from 'react-router-dom';

const emptyVar = {
	id: null,
	firstName: '',
	lastName: '',
	email: '',
	passwordHash: '',
	phoneNumber: '',
	addressLine1: '',
	addressLine2: '',
	city: '',
	province: '',
	postalCode: '',
	country: '',
};

const AdminCustomer = () => {
	const navigate = useNavigate();
	const [customers, setCustomers] = useState([]);
	const [formVisible, setFormVisible] = useState(false);
	const [formData, setFormData] = useState(emptyVar);

	// Tailwind class variables
	const tableCellClass = "border px-4 py-2";
	const inputClass = "w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400";
	const disabledInputClass = "w-full border px-3 py-2 rounded bg-gray-200 cursor-not-allowed";
	const buttonBaseClass = "text-white px-4 py-2 rounded hover:opacity-90 transition";

	// Fetch all customers
	const fetchCustomers = async () => {
		try {
			const data = await CustomerService.listCustomers();
			setCustomers(data);
		} catch (err) {
			console.error('Failed to fetch customers list', err);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleEdit = async (customerId) => {
		try {
			const customer = await CustomerService.getCustomerbyId(customerId);
			setFormData(customer);
			setFormVisible(true);
		} catch (err) {
			console.error('Failed to fetch customer', err);
		}
	};

	const handleDelete = async (customerId) => {
		if (window.confirm('Are you sure you want to delete this customer?')) {
			try {
				await CustomerService.deleteCustomer(customerId);
				fetchCustomers();
				alert('Customer successfully deleted');
			} catch (err) {
				console.error('Failed to delete customer', err);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await CustomerService.updateCustomer(formData.id, formData);
			setFormVisible(false);
			fetchCustomers();
			alert('Customer updated successfully');
		} catch (err) {
			console.error('Failed to update customer', err);
		}
	};

	return (
		<div className="p-6">
		<div className="relative mb-4">
			<button
				onClick={() => navigate('/admin')}
				className={`bg-blue-500 ${buttonBaseClass} hover:bg-blue-800 absolute left-0`}
			>
				Back to Admin Page
			</button>
			<h2 className="text-2xl font-bold text-black text-center">
				Customer List
			</h2>
		</div>


			<table className="min-w-full border border-gray-300">
				<thead className="bg-black text-white">
					<tr>
						<th className={tableCellClass}>ID</th>
						<th className={tableCellClass}>First Name</th>
						<th className={tableCellClass}>Last Name</th>
						<th className={tableCellClass}>Email</th>
						<th className={tableCellClass}>Phone</th>
						<th className={tableCellClass}>City</th>
						<th className={tableCellClass}>Province</th>
						<th className={tableCellClass}>Country</th>
						<th className={tableCellClass}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{customers.length > 0 ? (
						customers.map((c) => (
							<tr key={c.id} className="hover:bg-gray-50">
								<td className={tableCellClass}>{c.id}</td>
								<td className={tableCellClass}>{c.firstName}</td>
								<td className={tableCellClass}>{c.lastName}</td>
								<td className={tableCellClass}>{c.email}</td>
								<td className={tableCellClass}>{c.phoneNumber}</td>
								<td className={tableCellClass}>{c.city}</td>
								<td className={tableCellClass}>{c.province}</td>
								<td className={tableCellClass}>{c.country}</td>
								<td className={`${tableCellClass} space-x-2`}>
									<button
										onClick={() =>
											navigate(`/admin/orders?customerId=${c.id}`)
										}
										className={`bg-blue-500 ${buttonBaseClass} hover:bg-blue-800`}
									>
										View Orders
									</button>
									<button
										onClick={() => handleEdit(c.id)}
										className={`bg-red-500 ${buttonBaseClass} hover:bg-red-800`}
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(c.id)}
										className={`bg-red-500 ${buttonBaseClass} hover:bg-red-800`}
									>
										Delete
									</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="9" className={`text-center ${tableCellClass}`}>
								No customers found
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Edit Customer Form */}
			{formVisible && (
				<form
					onSubmit={handleSubmit}
					className="mt-6 space-y-4 p-4 border border-gray-300 rounded bg-gray-50"
				>
					<h3 className="text-xl font-semibold mb-2">Edit Customer</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block mb-1 font-medium">First Name</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								required
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Last Name</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								required
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								disabled
								className={disabledInputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Phone Number</label>
							<input
								type="text"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Address Line 1</label>
							<input
								type="text"
								name="addressLine1"
								value={formData.addressLine1}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Address Line 2</label>
							<input
								type="text"
								name="addressLine2"
								value={formData.addressLine2}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">City</label>
							<input
								type="text"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Province</label>
							<input
								type="text"
								name="province"
								value={formData.province}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Postal Code</label>
							<input
								type="text"
								name="postalCode"
								value={formData.postalCode}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Country</label>
							<input
								type="text"
								name="country"
								value={formData.country}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
					</div>

					<div className="flex space-x-2 mt-4">
						<button
							type="submit"
							className={`bg-red-500 ${buttonBaseClass} hover:bg-red-800`}
						>
							Update
						</button>
						<button
							type="button"
							onClick={() => setFormVisible(false)}
							className={`bg-gray-500 ${buttonBaseClass} hover:bg-gray-800`}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default AdminCustomer;
