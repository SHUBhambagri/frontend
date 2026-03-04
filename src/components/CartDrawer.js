import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, cartCount } = useCart();
  const [cartWithProducts, setCartWithProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadCartProducts();
    }
  }, [isOpen, cart]);

  const loadCartProducts = async () => {
    const productsWithDetails = await Promise.all(
      cart.map(async (item) => {
        try {
          const response = await axios.get(`${API}/products/${item.product_id}`);
          return { ...item, product: response.data };
        } catch (error) {
          console.error('Failed to load product:', error);
          return item;
        }
      })
    );
    setCartWithProducts(productsWithDetails);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} data-testid="cart-drawer-overlay"></div>
      <div className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white border-l-2 border-black z-50 flex flex-col" data-testid="cart-drawer">
        {/* Header */}
        <div className="border-b-2 border-black p-6 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold uppercase tracking-tighter">
            Cart ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 transition-colors"
            data-testid="cart-drawer-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartWithProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-400" />
              <p className="text-zinc-600 mb-4">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-block btn-primary"
                data-testid="cart-continue-shopping-btn"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartWithProducts.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-zinc-200 pb-6" data-testid={`cart-item-${item.id}`}>
                  <img
                    src={item.product?.images[0]}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover border border-zinc-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{item.product?.name}</h3>
                    <p className="text-sm text-zinc-600 mb-2">Size: {item.size}</p>
                    <p className="font-bold">₹{item.product?.price}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100"
                        data-testid={`cart-decrease-${item.id}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium" data-testid={`cart-quantity-${item.id}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100"
                        data-testid={`cart-increase-${item.id}`}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-sm text-red-600 hover:underline"
                        data-testid={`cart-remove-${item.id}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartWithProducts.length > 0 && (
          <div className="border-t-2 border-black p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total:</span>
              <span data-testid="cart-total">₹{cartTotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full btn-primary text-center"
              data-testid="cart-checkout-btn"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
