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

const initialSummary = { totalItems: 0, totalAmount: 0 };
const GUEST_CART_KEY = 'guestCart';

const safeStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const resolveCustomerId = () => {
  const storage = safeStorage();
  if (!storage) return null;
  const raw = storage.getItem('userId');
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const buildGuestKey = (productId, size) => `${productId}-${size || 'default'}`;

const normalizeGuestItems = (items = []) =>
  items.map((item) => ({
    itemId: buildGuestKey(item.productId, item.size),
    productId: item.productId,
    name: item.name,
    price: Number(item.price) || 0,
    quantity: item.quantity || 1,
    size: item.size,
    imageUrl: item.imageUrl,
    lineTotal: (Number(item.price) || 0) * (item.quantity || 1),
    isGuest: true,
  }));

const readGuestCart = () => {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return normalizeGuestItems(parsed);
  } catch {
    return [];
  }
};

const saveGuestCart = (items = []) => {
  const storage = safeStorage();
  if (!storage) return;
  const payload = items.map(({ productId, name, price, size, quantity, imageUrl }) => ({
    productId,
    name,
    price,
    size,
    quantity,
    imageUrl,
  }));
  storage.setItem(GUEST_CART_KEY, JSON.stringify(payload));
};

const calculateSummary = (items = []) => {
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  return { totalItems, totalAmount };
};

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(initialSummary);

  const applyGuestState = useCallback((items) => {
    const normalized = normalizeGuestItems(items);
    setCartItems(normalized);
    setSummary(calculateSummary(normalized));
    saveGuestCart(normalized);
  }, []);

  const fetchCartFromServer = useCallback(async () => {
    const customerId = resolveCustomerId();
    if (!customerId) {
      applyGuestState(readGuestCart());
      return;
    }
    try {
      const res = await CartService.getCart(customerId);
      const data = res.data || {};
      const normalized = (data.items || []).map((item) => ({
        itemId: item.itemId,
        productId: item.productId,
        name: item.name,
        price: Number(item.unitPrice) || 0,
        quantity: item.quantity,
        size: item.size,
        imageUrl: item.imageUrl,
        lineTotal: Number(item.lineTotal) || 0,
        isGuest: false,
      }));
      setCartItems(normalized);
      setSummary({
        totalItems: data.totalItems || 0,
        totalAmount: Number(data.totalAmount) || 0,
      });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, [applyGuestState]);

  const refreshCart = useCallback(() => {
    const customerId = resolveCustomerId();
    if (customerId) {
      fetchCartFromServer();
    } else {
      applyGuestState(readGuestCart());
    }
  }, [applyGuestState, fetchCartFromServer]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productInput, size, quantity = 1) => {
    const customerId = resolveCustomerId();
    const productPayload =
      typeof productInput === 'object' && productInput !== null
        ? {
            productId: Number(productInput.productId ?? productInput.id),
            name: productInput.name,
            price: Number(productInput.price) || 0,
            imageUrl: productInput.imageUrl,
          }
        : { productId: Number(productInput) };

    if (customerId) {
      await CartService.addItem(customerId, {
        productId: productPayload.productId,
        size,
        quantity,
      });
      await fetchCartFromServer();
      return;
    }

    if (!productPayload.name) {
      throw new Error('Product details required for guest cart');
    }

    const guestItems = readGuestCart();
    const existingIndex = guestItems.findIndex(
      (item) => item.productId === productPayload.productId && (item.size || null) === (size || null)
    );
    if (existingIndex >= 0) {
      guestItems[existingIndex].quantity += quantity;
    } else {
      guestItems.push({
        productId: productPayload.productId,
        name: productPayload.name,
        price: productPayload.price,
        imageUrl: productPayload.imageUrl,
        size,
        quantity,
      });
    }
    applyGuestState(guestItems);
  };

  const decreaseItem = async (itemId, currentQuantity) => {
    const customerId = resolveCustomerId();
    if (customerId) {
      if (currentQuantity <= 1) {
        await CartService.removeItem(customerId, itemId);
      } else {
        await CartService.updateItem(customerId, itemId, {
          quantity: currentQuantity - 1,
        });
      }
      await fetchCartFromServer();
      return;
    }

    const guestItems = readGuestCart();
    const updated = guestItems
      .map((item) => ({ ...item }))
      .filter((item) => {
        const key = buildGuestKey(item.productId, item.size);
        if (key !== itemId) return true;
        if (item.quantity <= 1) {
          return false;
        }
        item.quantity -= 1;
        return true;
      });
    applyGuestState(updated);
  };

  const deleteItem = async (itemId) => {
    const customerId = resolveCustomerId();
    if (customerId) {
      await CartService.removeItem(customerId, itemId);
      await fetchCartFromServer();
      return;
    }

    const guestItems = readGuestCart().filter((item) => buildGuestKey(item.productId, item.size) !== itemId);
    applyGuestState(guestItems);
  };

  const clearCart = () => {
    const customerId = resolveCustomerId();
    if (customerId) {
      fetchCartFromServer();
    } else {
      applyGuestState([]);
    }
  };

  const getTotalItems = () => summary.totalItems || 0;

  const syncGuestCartToServer = async () => {
    const customerId = resolveCustomerId();
    if (!customerId) return;
    const guestItems = readGuestCart();
    if (!guestItems.length) {
      await fetchCartFromServer();
      return;
    }
    for (const item of guestItems) {
      await CartService.addItem(customerId, {
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      });
    }
    saveGuestCart([]);
    await fetchCartFromServer();
  };

  return (
    <CartContext.Provider
      value={{
        cartProductList: cartItems,
        addToCart,
        decreaseItem,
        deleteItem,
        clearCart,
        getTotalItems,
        refreshProducts: refreshCart,
        syncGuestCartToServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
