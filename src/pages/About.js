import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white">
      <div className="py-24 border-b-2 border-black bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter mb-6">
            About WallPix
          </h1>
          <p className="text-lg md:text-xl text-zinc-700 leading-relaxed">
            Transforming spaces with premium aesthetic wall art
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 space-y-12">
        <div>
          <h2 className="text-3xl font-heading font-bold uppercase mb-4">Our Story</h2>
          <p className="text-lg leading-relaxed text-zinc-700">
            Founded in 2024, WallPix was born from a simple idea: everyone deserves beautiful, high-quality wall art
            that doesn't break the bank. We curate and create aesthetic posters that speak to the modern generation
            — bold, minimal, and unapologetically stylish.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-heading font-bold uppercase mb-4">Our Promise</h2>
          <ul className="space-y-4 text-lg text-zinc-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Premium Quality:</strong> 300 GSM paper with HD printing for vibrant, long-lasting colors</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Fast Shipping:</strong> Free shipping on orders above ₹500</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Made to Order:</strong> Each poster is printed fresh, just for you</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Customer First:</strong> 24/7 support and hassle-free returns</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-heading font-bold uppercase mb-4">Why Choose Us?</h2>
          <p className="text-lg leading-relaxed text-zinc-700">
            We're not just selling posters — we're helping you create spaces that inspire. Whether you're a student
            decorating your dorm, a professional setting up a home office, or an aesthetic enthusiast curating the
            perfect feed-worthy room, WallPix has something for everyone.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
