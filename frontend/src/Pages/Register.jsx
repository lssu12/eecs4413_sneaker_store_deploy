import React, { useState } from 'react';
import AuthService from '../Service/AuthService';
import { useNavigate, useLocation } from 'react-router-dom';

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
	const location = useLocation();
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const showError = (message) => {
		setErrorMessage(message);
		setSuccessMessage('');
	};

	const showSuccess = (message) => {
		setSuccessMessage(message);
		setErrorMessage('');
	};

	const REQUIRED_FIELDS = {
		firstName: 'First Name',
		lastName: 'Last Name',
		email: 'Email Address',
		phoneNumber: 'Phone Number',
		password: 'Password',
		addressLine1: 'Address Line 1',
		city: 'City',
		province: 'Province / State',
		postalCode: 'Postal / ZIP Code',
		country: 'Country',
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const missingFields = Object.entries(REQUIRED_FIELDS)
			.filter(([field]) => !(formData[field] ?? '').toString().trim())
			.map(([, label]) => label);

		if (missingFields.length > 0) {
			showError(`Please fill in: ${missingFields.join(', ')}`);
			return;
		}

		setErrorMessage('');
		setSuccessMessage('');
		try {
			const response = await AuthService.registerUser(formData);
			if (response.success) {
				const redirectTo = location.state?.from;
				if (redirectTo) {
					showSuccess('Registration successful! Logging you in...');
					try {
						const loginResponse = await AuthService.loginUser({ email: formData.email, password: formData.password });
						if (loginResponse.token && loginResponse.customerId) {
							navigate(redirectTo, { replace: true });
							return;
						}
					} catch (loginErr) {
						console.error('Auto login failed after registration', loginErr);
						showError('Registered, but auto login failed. Please log in manually.');
					}
				}
				showSuccess('Registration successful! Please log in.');
				navigate('/login');
			} else {
				showError(response.message || 'Registration failed.');
			}
		} catch (err) {
			console.error(err);
			const backendMessage = err?.response?.data?.message;
			showError(backendMessage || 'Registration failed. Please try again.');
		}
	};

	// Tailwind class variables
	const pageContainer = "min-h-screen flex items-center justify-center bg-brand-surface text-brand-primary px-4";
	const card = "w-full max-w-xl bg-white p-8 rounded-3xl border border-brand-muted shadow-sm";
	const heading = "text-3xl font-display font-semibold text-center mb-6";
	const formGrid = "grid grid-cols-1 md:grid-cols-2 gap-4";
	const formGroup = "flex flex-col";
	const labelClass = "mb-1 text-brand-secondary font-medium";
	const inputClass = "w-full px-4 py-2 border border-brand-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent";
	const fullWidth = "md:col-span-2";
	const submitButton = "md:col-span-2 mt-4 bg-brand-primary text-white py-3 rounded-full font-semibold hover:bg-brand-secondary transition";

	return (
		<div className={pageContainer}>
			<div className={card}>
				<h1 className={heading}>Register</h1>

				<form onSubmit={handleSubmit} className={formGrid}>
					{errorMessage && (
						<p className={`${fullWidth} text-red-600 text-sm`}>{errorMessage}</p>
					)}
					{successMessage && (
						<p className={`${fullWidth} text-green-700 text-sm`}>{successMessage}</p>
					)}
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
						<input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Password</label>
						<input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={`${formGroup} ${fullWidth}`}>
						<label className={labelClass}>Address Line 1</label>
						<input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={`${formGroup} ${fullWidth}`}>
						<label className={labelClass}>Address Line 2</label>
						<input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>City</label>
						<input type="text" name="city" value={formData.city} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Province / State</label>
						<input type="text" name="province" value={formData.province} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Postal / ZIP Code</label>
						<input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required className={inputClass} />
					</div>

					<div className={formGroup}>
						<label className={labelClass}>Country</label>
						<input type="text" name="country" value={formData.country} onChange={handleChange} required className={inputClass} />
					</div>

					<button type="submit" className={submitButton}>Register</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
