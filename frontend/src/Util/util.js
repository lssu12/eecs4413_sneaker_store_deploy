export const BASE_URL = 'http://localhost:8080'; 

export const getHeader= () => {
	// Try to access the token
	const token = localStorage.getItem('token');
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	};
}

