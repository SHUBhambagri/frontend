import { motion } from 'framer-motion';
import { useState } from 'react';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`${API}/orders/track/${orderNumber}?email=${email}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-12">
          Track Your Order
        </h1>

        <form onSubmit={handleTrack} className="border-2 border-black p-8 mb-12">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2">
                Order Number
              </label>
              <input type="text" value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)} required
                className="input-field w-full" placeholder="WP20260101XXXXXX"
                data-testid="track-order-number-input" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2">
                Email Address
              </label>
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="input-field w-full" placeholder="your@email.com"
                data-testid="track-email-input" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary"
              data-testid="track-order-btn">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        </form>

        {order && (
          <div className="border-2 border-black p-8">
            <h2 className="text-2xl font-bold uppercase mb-6">Order Details</h2>
            <div className="mb-8">
              <p className="text-sm text-zinc-600 mb-1">Order Number</p>
              <p className="font-bold text-lg">{order.order_number}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 border-2 ${order.payment_status === 'paid' ? 'border-black bg-black text-white' : 'border-zinc-300'}`}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold uppercase">Order Confirmed</h3>
                  <p className="text-sm text-zinc-600">Payment {order.payment_status}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`p-3 border-2 ${order.shipping_status === 'shipped' || order.shipping_status === 'delivered' ? 'border-black bg-black text-white' : 'border-zinc-300'}`}>
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold uppercase">Processing</h3>
                  <p className="text-sm text-zinc-600">Your order is being prepared</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`p-3 border-2 ${order.shipping_status === 'shipped' || order.shipping_status === 'delivered' ? 'border-black bg-black text-white' : 'border-zinc-300'}`}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-bold uppercase">Shipped</h3>
                  {order.tracking_id && (
                    <p className="text-sm font-medium">Tracking: {order.tracking_id}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`p-3 border-2 ${order.shipping_status === 'delivered' ? 'border-black bg-black text-white' : 'border-zinc-300'}`}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold uppercase">Delivered</h3>
                  <p className="text-sm text-zinc-600">
                    {order.shipping_status === 'delivered' ? 'Order delivered successfully' : 'Awaiting delivery'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-black">
              <h3 className="font-bold uppercase text-sm mb-4">Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border" />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-zinc-600">Size: {item.size} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
