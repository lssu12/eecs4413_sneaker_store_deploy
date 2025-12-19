import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../Service/AuthService';
import Toast from '../Components/Toast';

const LoginSignup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const [toast, setToast] = useState(null);

	const showToast = (message, type = 'info') => {
		setToast({ message, type });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await AuthService.loginUser({ email, password });
			const { token, customerId, role } = response;

			if (!token || !customerId) {
				showToast('Login failed. Please try again.', 'error');
				return;
			}

			showToast('Successfully logged in', 'success');
			const redirectTo = location.state?.from || '/sneakers';
			const destination = role === 'ADMIN' ? '/admin' : redirectTo;
			navigate(destination);
		} catch (err) {
			console.error(err);
			showToast('Login failed. Please check email and password.', 'error');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-brand-surface px-4 text-brand-primary">
			<Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
			<form
				onSubmit={handleSubmit}
				className="bg-white p-10 rounded-3xl border border-brand-muted shadow-sm w-full max-w-md"
			>
				<h1 className="text-3xl font-display font-semibold text-center mb-6">Login</h1>

				<div className="space-y-4">
					<input
						type="text"
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border border-brand-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent"
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
					/>
				</div>

					<button
						type="submit"
						className="w-full mt-6 bg-brand-primary text-white py-3 rounded-full hover:bg-brand-secondary transition"
					>
					Login
				</button>

					<p className="text-center text-sm mt-4">
						Not a member?{' '}
					<span
						className="text-brand-accent font-semibold cursor-pointer hover:underline"
						onClick={() => navigate('/register', { state: location.state })}
					>
						Sign Up
					</span>
				</p>
			</form>
		</div>
	);
};

export default LoginSignup;
