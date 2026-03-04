import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [cartWithProducts, setCartWithProducts] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }
    loadCartProducts();
  }, [cart]);

  useEffect(() => {
    setShippingCost(cartTotal > 500 ? 0 : 50);
  }, [cartTotal]);

  const loadCartProducts = async () => {
    const productsWithDetails = await Promise.all(
      cart.map(async (item) => {
        try {
          const response = await axios.get(`${API}/products/${item.product_id}`);
          return { ...item, product: response.data };
        } catch (error) {
          return item;
        }
      })
    );
    setCartWithProducts(productsWithDetails);
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post(`${API}/coupons/validate`, {
        code: couponCode,
        order_total: cartTotal
      });
      setDiscount(response.data.discount);
      toast.success(`Coupon applied! ₹${response.data.discount} discount`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid coupon code');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cartWithProducts.map(item => ({
        product_id: item.product_id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        image: item.product.images[0]
      }));

      const orderData = {
        items: orderItems,
        shipping_address: address,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined
      };

      const orderResponse = await axios.post(`${API}/orders/create`, orderData);
      const order = orderResponse.data;

      if (paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success?order_id=${order.id}`);
      } else if (paymentMethod === 'stripe') {
        const sessionResponse = await axios.post(
          `${API}/payments/stripe/create-session?order_id=${order.id}`,
          {},
          { headers: { origin: window.location.origin } }
        );
        window.location.href = sessionResponse.data.url;
      } else if (paymentMethod === 'razorpay') {
        const razorpayResponse = await axios.post(`${API}/payments/razorpay/create-order?order_id=${order.id}`);
        const options = {
          key: razorpayResponse.data.key_id,
          amount: razorpayResponse.data.amount,
          currency: razorpayResponse.data.currency,
          order_id: razorpayResponse.data.order_id,
          name: 'WallPix',
          description: 'Premium Wall Posters',
          handler: async (response) => {
            try {
              await axios.post(`${API}/payments/razorpay/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              clearCart();
              toast.success('Payment successful!');
              navigate(`/order-success?order_id=${order.id}`);
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: address.name,
            email: address.email,
            contact: address.phone
          }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = cartTotal - discount + shippingCost;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              <div className="border-2 border-black p-6">
                <h2 className="text-2xl font-bold uppercase mb-6">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })} required
                    className="input-field" data-testid="checkout-name-input" />
                  <input type="email" placeholder="Email" value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })} required
                    className="input-field" data-testid="checkout-email-input" />
                  <input type="tel" placeholder="Phone" value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} required
                    className="input-field md:col-span-2" data-testid="checkout-phone-input" />
                  <input type="text" placeholder="Address" value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })} required
                    className="input-field md:col-span-2" data-testid="checkout-address-input" />
                  <input type="text" placeholder="City" value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} required
                    className="input-field" data-testid="checkout-city-input" />
                  <input type="text" placeholder="State" value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })} required
                    className="input-field" data-testid="checkout-state-input" />
                  <input type="text" placeholder="Pincode" value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required
                    className="input-field md:col-span-2" data-testid="checkout-pincode-input" />
                </div>
              </div>

              <div className="border-2 border-black p-6">
                <h2 className="text-2xl font-bold uppercase mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-zinc-200 hover:border-black cursor-pointer">
                    <input type="radio" value="stripe" checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3"
                      data-testid="payment-stripe" />
                    <span className="font-bold uppercase">Stripe (Card Payment)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-zinc-200 hover:border-black cursor-pointer">
                    <input type="radio" value="razorpay" checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3"
                      data-testid="payment-razorpay" />
                    <span className="font-bold uppercase">Razorpay (UPI, Cards, Net Banking)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-zinc-200 hover:border-black cursor-pointer">
                    <input type="radio" value="cod" checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3"
                      data-testid="payment-cod" />
                    <span className="font-bold uppercase">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary" data-testid="place-order-btn">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div>
            <div className="border-2 border-black p-6 sticky top-24">
              <h2 className="text-2xl font-bold uppercase mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartWithProducts.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img src={item.product?.images[0]} alt={item.product?.name} className="w-16 h-16 object-cover border" />
                    <div className="flex-1">
                      <p className="font-bold">{item.product?.name}</p>
                      <p className="text-zinc-600">Size: {item.size} × {item.quantity}</p>
                      <p className="font-bold">₹{item.product?.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <input type="text" placeholder="Coupon Code" value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)} className="input-field w-full mb-2"
                  data-testid="coupon-input" />
                <button type="button" onClick={handleApplyCoupon} className="btn-outline w-full py-2 px-4"
                  data-testid="apply-coupon-btn">Apply Coupon</button>
              </div>

              <div className="space-y-2 py-4 border-t border-b border-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mt-4">
                <span>Total:</span>
                <span data-testid="checkout-total">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
