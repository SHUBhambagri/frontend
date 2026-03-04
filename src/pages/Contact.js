import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white">
      <div className="py-24 border-b-2 border-black bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-zinc-700">
            We'd love to hear from you
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 border-2 border-black">
            <Mail size={32} className="mx-auto mb-4" />
            <h3 className="font-bold uppercase text-sm mb-2">Email</h3>
            <p className="text-zinc-600">support@wallpix.com</p>
          </div>
          <div className="text-center p-8 border-2 border-black">
            <Phone size={32} className="mx-auto mb-4" />
            <h3 className="font-bold uppercase text-sm mb-2">Phone</h3>
            <p className="text-zinc-600">+91 98765 43210</p>
          </div>
          <div className="text-center p-8 border-2 border-black">
            <MapPin size={32} className="mx-auto mb-4" />
            <h3 className="font-bold uppercase text-sm mb-2">Location</h3>
            <p className="text-zinc-600">Mumbai, India</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto border-2 border-black p-8">
          <h2 className="text-3xl font-heading font-bold uppercase mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2">Name</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                className="input-field w-full" data-testid="contact-name-input" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2">Email</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                className="input-field w-full" data-testid="contact-email-input" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2">Message</label>
              <textarea value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} required
                rows="6" className="input-field w-full" data-testid="contact-message-input"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary" data-testid="contact-submit-btn">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
