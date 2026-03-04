import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold uppercase tracking-tighter mb-12">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-zinc-700 leading-relaxed">
          <p>Last updated: January 2026</p>
          <p>At WallPix, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <p>We collect information you provide directly to us, including name, email address, shipping address, and payment information.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
          <p>We use your information to process orders, communicate with you, and improve our services.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </div>
      </div>
    </motion.div>
  );
}
