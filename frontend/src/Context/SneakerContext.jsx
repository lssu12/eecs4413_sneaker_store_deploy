import React, { createContext, useState, useEffect } from 'react';

export const SneakerContext = createContext(null);

const SneakerContextProvider = ({ children }) => {
	const [all_product, setAllProduct] = useState([]);
	const [cartItems, setCartItems] = useState({});

	// Fetch sneakers from backend
	useEffect(() => {
		const fetchSneakers = async () => {
			try {
				const res = await fetch('http://localhost:8080/api/sneakers');

				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
				const data = await res.json();
				setAllProduct(data);

				// Initialize cart with product IDs
				const cart = {};
				data.forEach((item) => (cart[item.id] = 0));
				setCartItems(cart);
			} catch (err) {
				console.error('Failed to fetch sneakers:', err);
			}
		};
		fetchSneakers();
	}, []);

	const addToCart = (itemId) => {
		setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
	};

	const contextValue = { all_product, cartItems, addToCart };
	return <SneakerContext.Provider value={contextValue}>{children}</SneakerContext.Provider>;
};

export default SneakerContextProvider;
