import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';

const LoginSignup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await AuthService.loginUser({ email, password });
			const { token, customerId } = response;

			if (!token || !customerId) {
				alert('Login failed');
				return;
			}

			alert('Successful login');

			if (email === 'demo@sneakerstore.test') {
				localStorage.setItem('role', 'ADMIN');
				navigate('/admin');
			} else {
				localStorage.setItem('role', 'USER');
				navigate('/sneakers');
			}
		} catch (err) {
			console.error(err);
			alert('Login failed. Please check email and password.');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
			>
				<h1 className="text-2xl font-bold text-center mb-6">Login</h1>

				<div className="space-y-4">
					<input
						type="text"
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
					className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-800 transition"
				>
					Login
				</button>

				<p className="text-center text-sm mt-4">
					Not a member?{' '}
					<span
						className="text-black font-semibold cursor-pointer hover:underline"
						onClick={() => navigate('/register')}
					>
						Sign Up
					</span>
				</p>
			</form>
		</div>
	);
};

export default LoginSignup;
