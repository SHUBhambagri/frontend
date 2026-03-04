import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold uppercase tracking-tighter mb-12">
          Terms of Service
        </h1>
        <div className="space-y-6 text-zinc-700 leading-relaxed">
          <p>Last updated: January 2026</p>
          <p>By accessing and using WallPix, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Use of Service</h2>
          <p>You may use our service only for lawful purposes and in accordance with these Terms.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Orders and Payment</h2>
          <p>All orders are subject to acceptance and availability. Payment must be made in full before shipment.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Returns and Refunds</h2>
          <p>We accept returns within 7 days of delivery for defective or damaged products.</p>
        </div>
      </div>
    </motion.div>
  );
}
