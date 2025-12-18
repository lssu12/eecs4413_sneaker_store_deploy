import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const CartContextProvider = ({ children }) => {
	// All products fetched from backend
	const [allProduct, setAllProduct] = useState([]);

	// Current cart (no login required)
	const [cart, setCart] = useState({});

	// Fetch products once
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch('http://localhost:8080/api/sneakers');
				const data = await res.json();
				const products = data.map((p) => ({ ...p, id: String(p.id), price: parseFloat(p.price) }));
				setAllProduct(products);
				console.log('[Debug] Fetched products:', products);
			} catch (err) {
				console.error('[Debug] Failed to fetch products:', err);
			}
		};
		fetchProducts();
	}, []);

	// Add item to cart
	const addToCart = (key) => {
		setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
		console.log(`[Debug] Added ${key}, quantity: ${cart[key] ? cart[key] + 1 : 1}`);
	};

	// Decrease item quantity
	const decreaseItem = (key) => {
		setCart((prev) => {
			const qty = prev[key] || 0;
			if (qty <= 1) {
				const { [key]: _, ...rest } = prev;
				console.log(`[Debug] Removed ${key}`);
				return rest;
			}
			console.log(`[Debug] Decreased ${key}, quantity: ${qty - 1}`);
			return { ...prev, [key]: qty - 1 };
		});
	};

	// Delete item
	const deleteItem = (key) => {
		setCart((prev) => {
			const { [key]: _, ...rest } = prev;
			console.log(`[Debug] Deleted ${key}`);
			return rest;
		});
	};

	// Clear cart
	const clearCart = () => {
		setCart({});
		console.log('[Debug] Cleared cart');
	};

	// Total items
	const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);

	// Cart product list
	const cartProductList = Object.keys(cart).map((key) => {
		const [id, size] = key.split('-');
		const product = allProduct.find((p) => p.id === id);
		if (!product) return { id, name: 'Unknown Product', price: 0, quantity: cart[key], size };
		return { ...product, quantity: cart[key], size };
	});

	return (
		<CartContext.Provider
			value={{
				allProduct,
				cartItems: cart,
				cartProductList,
				addToCart,
				decreaseItem,
				deleteItem,
				clearCart,
				getTotalItems,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export default CartContextProvider;
