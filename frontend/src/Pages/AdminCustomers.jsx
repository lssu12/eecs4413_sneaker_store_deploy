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
	const tableCellClass = "border border-brand-muted/70 px-4 py-2 text-sm";
	const inputClass = "w-full border border-brand-muted px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent";
	const disabledInputClass = "w-full border border-brand-muted px-3 py-2 rounded-md bg-brand-muted/40 cursor-not-allowed";
	const buttonBaseClass = "text-white px-4 py-2 rounded-full hover:opacity-90 transition";
	const labelClass = "block mb-1 font-medium text-brand-secondary";

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
		if (!window.confirm('Are you sure you want to delete this customer?')) {
			return;
		}
		try {
			await CustomerService.deleteCustomer(customerId);
			fetchCustomers();
			alert('Customer successfully deleted');
		} catch (err) {
			if (err?.response?.status === 409) {
				alert("You can't delete the customer who has an active order.");
			} else if (err?.response?.status === 403) {
				alert("Admin accounts cannot be deleted.");
			} else {
				console.error('Failed to delete customer', err);
				alert('Failed to delete customer. Please try again.');
			}
		}
	};

	const handleViewOrders = (customer) => {
		navigate(`/admin/orders?customerId=${customer.id}`, {
			state: {
				customerContext: {
					id: customer.id,
					firstName: customer.firstName,
					lastName: customer.lastName,
					email: customer.email,
				},
			},
		});
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
		<div className="p-6 bg-brand-surface min-h-screen text-brand-primary">
	<div className="relative mb-4">
		<button
			onClick={() => navigate('/admin')}
			className={`bg-brand-primary ${buttonBaseClass} hover:bg-brand-secondary absolute left-0`}
		>
			Back to Admin Page
		</button>
		<h2 className="text-2xl font-display font-semibold text-center">
			Customer List
		</h2>
	</div>


			<table className="min-w-full border border-brand-muted bg-white shadow-sm">
				<thead className="bg-brand-primary text-white">
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
								<tr key={c.id} className="hover:bg-brand-surface">
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
											onClick={() => handleViewOrders(c)}
											className={`bg-brand-secondary ${buttonBaseClass} hover:bg-brand-primary`}
										>
											View Orders
										</button>
										<button
											onClick={() => handleEdit(c.id)}
											className={`bg-brand-accent ${buttonBaseClass} hover:bg-brand-accent-dark`}
										>
											Edit
										</button>
										{(() => {
											const isAdminAccount = c.role === 'ADMIN';
											const deleteClass = isAdminAccount
												? 'px-4 py-2 rounded-full bg-brand-muted text-brand-secondary cursor-not-allowed opacity-60'
												: `bg-brand-accent ${buttonBaseClass} hover:bg-brand-accent-dark`;
											return (
												<button
													onClick={() => {
														if (!isAdminAccount) {
															handleDelete(c.id);
														}
													}}
													disabled={isAdminAccount}
													className={deleteClass}
												>
													Delete
												</button>
											);
										})()}
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
						className="mt-6 space-y-4 p-6 border border-brand-muted rounded-3xl bg-white shadow-sm"
					>
						<h3 className="text-xl font-semibold mb-2 text-brand-primary">Edit Customer</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>First Name</label>
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
							<label className={labelClass}>Last Name</label>
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
							<label className={labelClass}>Email</label>
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
							<label className={labelClass}>Phone Number</label>
							<input
								type="text"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Address Line 1</label>
							<input
								type="text"
								name="addressLine1"
								value={formData.addressLine1}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Address Line 2</label>
							<input
								type="text"
								name="addressLine2"
								value={formData.addressLine2}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>City</label>
							<input
								type="text"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Province</label>
							<input
								type="text"
								name="province"
								value={formData.province}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Postal Code</label>
							<input
								type="text"
								name="postalCode"
								value={formData.postalCode}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Country</label>
							<input
								type="text"
								name="country"
								value={formData.country}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
					</div>

					<div className="flex space-x-3 mt-4">
						<button
							type="submit"
							className={`bg-brand-primary ${buttonBaseClass} hover:bg-brand-secondary`}
						>
							Update
						</button>
						<button
							type="button"
							onClick={() => setFormVisible(false)}
							className="bg-brand-muted text-brand-primary px-4 py-2 rounded-full hover:bg-brand-accent/70 transition"
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
