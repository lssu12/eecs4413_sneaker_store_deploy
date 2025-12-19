import React, { createContext, useState, useEffect } from 'react';
import SneakerService from '../Service/SneakerService';

export const SneakerContext = createContext(null);

const SneakerContextProvider = ({ children }) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});

  
  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const data = await SneakerService.fetchSneakers();
        setAllProduct(data);

        
        const cart = {};
        data.forEach((item) => {
          cart[item.id] = 0;
        });
        setCartItems(cart);
      } catch (err) {
        console.error('Failed to fetch sneakers:', err);
      }
    };

    fetchSneakers();
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
  };

  return (
    <SneakerContext.Provider value={contextValue}>
      {children}
    </SneakerContext.Provider>
  );
};

export default SneakerContextProvider;
