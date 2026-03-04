import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Package } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders/my-orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-12">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-24 border-2 border-black">
            <Package size={64} className="mx-auto mb-6 text-zinc-400" />
            <p className="text-xl text-zinc-600 mb-6">No orders yet</p>
            <Link to="/shop" className="inline-block btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border-2 border-black p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <p className="text-sm text-zinc-600">Order Number</p>
                    <p className="text-xl font-bold">{order.order_number}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-zinc-600">Payment</p>
                      <p className={`font-bold uppercase ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {order.payment_status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-zinc-600">Shipping</p>
                      <p className="font-bold uppercase">{order.shipping_status}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border" />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-zinc-600">Size: {item.size} × {item.quantity}</p>
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-zinc-300">
                  <div>
                    <p className="text-sm text-zinc-600">Total</p>
                    <p className="text-2xl font-bold">₹{order.total}</p>
                  </div>
                  <Link
                    to={`/track-order`}
                    className="btn-outline px-6 py-3"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
