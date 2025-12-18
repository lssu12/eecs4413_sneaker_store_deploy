import React, { useState } from 'react';
import AuthService from '../Service/AuthService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		addressLine1: '',
		addressLine2: '',
		password: '',
		city: '',
		province: '',
		postalCode: '',
		country: '',
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await AuthService.registerUser(formData);
			if (response.success) {
				alert('Registration successful!');
				navigate('/login');
			} else {
				alert(response.message || 'Registration failed');
			}
		} catch (err) {
			alert('Registration failed. Please try again.');
			console.error(err);
		}
	};

	// Tailwind class variables
	const pageContainer = "min-h-screen flex items-center justify-center bg-gray-100";
	const card = "w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg";
	const heading = "text-2xl font-bold text-center mb-6 text-gray-900";
	const formGrid = "grid grid-cols-1 md:grid-cols-2 gap-4";
	const formGroup = "flex flex-col";
	const labelClass = "mb-1 text-gray-700 font-medium";
	const inputClass = "w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black";
	const fullWidth = "md:col-span-2";
	const submitButton = "md:col-span-2 mt-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition";

	return (
		<div className={pageContainer}>
			<div className={card}>
				<h1 className={heading}>Register</h1>

				<form onSubmit={handleSubmit} className={formGrid}>
					<div className={formGroup}>
						<label className={labelClass}>First Name</label>
						<input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Last Name</label>
						<input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={`${formGroup} ${fullWidth}`}>
						<label className={labelClass}>Email Address</label>
						<input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Phone Number</label>
						<input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Password</label>
						<input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={`${formGroup} ${fullWidth}`}>
						<label className={labelClass}>Address Line 1</label>
						<input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className={inputClass} />
					</div>

					<div className={`${formGroup} ${fullWidth}`}>
						<label className={labelClass}>Address Line 2</label>
						<input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>City</label>
						<input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Province / State</label>
						<input type="text" name="province" value={formData.province} onChange={handleChange} className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Postal / ZIP Code</label>
						<input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Country</label>
						<input type="text" name="country" value={formData.country} onChange={handleChange} className={inputClass} />
					</div>

					<button type="submit" className={submitButton}>Register</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
