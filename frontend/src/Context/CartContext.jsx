import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import CartService from '../Service/CartService';


export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const CUSTOMER_ID = 'guest';

const CartContextProvider = ({ children }) => {

  const [allProduct, setAllProduct] = useState([]);
  const [cart, setCart] = useState({});

  
  const fetchProducts = useCallback(async () => {
    try {
      const res = await CartService.getCart(CUSTOMER_ID);
      const products = (res.data.products || []).map((p) => ({
        ...p,
        id: String(p.id),
        price: parseFloat(p.price),
      }));

      setAllProduct(products);
      console.log('Fetched products:', products);
    } catch (err) {
      console.error(' Failed to fetch products:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const addToCart = async (key) => {
    const [id, size] = key.split('-');

    setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

    try {
      await CartService.addItem(CUSTOMER_ID, {
        productId: id,
        size,
        quantity: 1,
      });
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };


  const decreaseItem = async (key) => {
    const [id] = key.split('-');

    setCart((prev) => {
      const qty = prev[key] || 0;
      if (qty <= 1) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: qty - 1 };
    });

    try {
      await CartService.updateItem(CUSTOMER_ID, id, { quantity: -1 });
    } catch (err) {
      console.error('Failed to decrease item:', err);
    }
  };


  const deleteItem = async (key) => {
    const [id] = key.split('-');

    setCart((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });

    try {
      await CartService.removeItem(CUSTOMER_ID, id);
    } catch (err) {
      console.error(' Failed to delete item:', err);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart({});
    console.log(' Cleared cart');
  };

  // Total items
  const getTotalItems = () =>
    Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Cart product list
  const cartProductList = Object.keys(cart).map((key) => {
    const [id, size] = key.split('-');
    const product = allProduct.find((p) => p.id === id);

    if (!product) {
      return {
        id,
        name: 'Unknown Product',
        price: 0,
        quantity: cart[key],
        size,
      };
    }

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
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
