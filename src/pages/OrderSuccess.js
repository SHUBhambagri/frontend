import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else if (orderId) {
      fetchOrder();
    }
  }, [sessionId, orderId]);

  const checkPaymentStatus = async () => {
    let attempts = 0;
    const maxAttempts = 5;
    const pollInterval = 2000;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API}/payments/stripe/status/${sessionId}`);
        if (response.data.payment_status === 'paid') {
          fetchOrder(response.data.order_id);
        } else {
          attempts++;
          setTimeout(poll, pollInterval);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    poll();
  };

  const fetchOrder = async (id = orderId) => {
    try {
      const response = await axios.get(`${API}/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
          <p className="text-lg font-medium">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <CheckCircle size={80} className="mx-auto mb-8 text-black" />
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold uppercase tracking-tighter mb-6">
          Order Placed!
        </h1>
        <p className="text-lg text-zinc-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {order && (
          <div className="border-2 border-black p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold uppercase mb-4">Order Details</h2>
            <div className="space-y-2 mb-6">
              <p><strong>Order Number:</strong> {order.order_number}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Payment Status:</strong> {order.payment_status}</p>
            </div>
            <p className="text-sm text-zinc-600">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="btn-primary inline-block">Continue Shopping</Link>
          <Link to="/my-orders" className="btn-outline inline-block">View My Orders</Link>
        </div>
      </div>
    </motion.div>
  );
}
