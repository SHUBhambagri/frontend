import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchCart();
      fetchWishlist();
    } else {
      // Load cart from localStorage for guest users
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCart(guestCart);
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API}/wishlist`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const addToCart = async (product_id, quantity, size) => {
    if (!user) {
      // Guest cart
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingIndex = guestCart.findIndex(item => item.product_id === product_id && item.size === size);
      
      if (existingIndex > -1) {
        guestCart[existingIndex].quantity += quantity;
      } else {
        guestCart.push({ product_id, quantity, size, id: Date.now().toString() });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setCart(guestCart);
      return;
    }

    try {
      await axios.post(`${API}/cart/add`, { product_id, quantity, size });
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (item_id) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updatedCart = guestCart.filter(item => item.id !== item_id);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      return;
    }

    try {
      await axios.delete(`${API}/cart/remove/${item_id}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateCartQuantity = async (item_id, quantity) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const itemIndex = guestCart.findIndex(item => item.id === item_id);
      if (itemIndex > -1) {
        if (quantity <= 0) {
          guestCart.splice(itemIndex, 1);
        } else {
          guestCart[itemIndex].quantity = quantity;
        }
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setCart(guestCart);
      return;
    }

    try {
      await axios.put(`${API}/cart/update/${item_id}?quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const addToWishlist = async (product_id) => {
    if (!user) {
      throw new Error('Please login to add to wishlist');
    }

    try {
      await axios.post(`${API}/wishlist/add/${product_id}`);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (product_id) => {
    try {
      await axios.delete(`${API}/wishlist/remove/${product_id}`);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const isInWishlist = (product_id) => {
    return wishlist.some(item => item.product_id === product_id);
  };

  const clearCart = () => {
    if (!user) {
      localStorage.removeItem('guestCart');
      setCart([]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearCart,
      cartTotal,
      cartCount,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}