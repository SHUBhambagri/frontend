import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Award, Instagram, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products?featured=true`);
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Marquee Banner */}
      <div className="bg-[#D4F66C] text-black py-2 overflow-hidden border-b-2 border-black">
        <div className="flex whitespace-nowrap">
          <div className="marquee-content flex items-center space-x-8 px-8">
            <span className="text-sm font-bold uppercase tracking-widest">FREE GIFT FOR FIRST 100 CUSTOMERS</span>
            <span className="text-sm font-bold uppercase tracking-widest">•</span>
            <span className="text-sm font-bold uppercase tracking-widest">FREE SHIPPING ABOVE ₹500</span>
            <span className="text-sm font-bold uppercase tracking-widest">•</span>
            <span className="text-sm font-bold uppercase tracking-widest">PREMIUM 300 GSM PAPER</span>
            <span className="text-sm font-bold uppercase tracking-widest">•</span>
          </div>
          <div className="marquee-content flex items-center space-x-8 px-8">
            <span className="text-sm font-bold uppercase tracking-widest">FREE GIFT FOR FIRST 100 CUSTOMERS</span>
            <span className="text-sm font-bold uppercase tracking-widest">•</span>
            <span className="text-sm font-bold uppercase tracking-widest">FREE SHIPPING ABOVE ₹500</span>
            <span className="text-sm font-bold uppercase tracking-widest">•</span>
            <span className="text-sm font-bold uppercase tracking-widest">PREMIUM 300 GSM PAPER</span>
            <span className="text-sm font-bold uppercase tracking-widest">•</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="h-[85vh] w-full flex flex-col justify-end pb-12 relative overflow-hidden bg-zinc-100">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1772140067317-d4ab304486a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBwb3N0ZXIlMjB3YWxsJTIwYXJ0JTIwbW9kZXJufGVufDB8fHx8MTc3MjU1NDY0MXww&ixlib=rb-4.1.0&q=85"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter uppercase leading-[0.9] text-white mb-6"
          >
            TRANSFORM
            <br />
            YOUR WALLS
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg font-normal leading-relaxed text-white/90 max-w-md mb-8"
          >
            Premium aesthetic posters. HD print quality. 300 GSM paper.
            Curated for the bold.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/shop"
              data-testid="hero-shop-now-btn"
              className="inline-flex items-center rounded-none border-2 border-white bg-white text-black hover:bg-transparent hover:text-white transition-all duration-300 font-bold uppercase tracking-wider px-8 py-4"
            >
              SHOP NOW
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-b-2 border-black py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <ShieldCheck size={32} className="flex-shrink-0" />
              <div>
                <h3 className="font-bold uppercase tracking-wider text-sm">Secure Payment</h3>
                <p className="text-sm text-zinc-600">100% Safe & Secure</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <Truck size={32} className="flex-shrink-0" />
              <div>
                <h3 className="font-bold uppercase tracking-wider text-sm">Fast Shipping</h3>
                <p className="text-sm text-zinc-600">Free Above ₹500</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <Award size={32} className="flex-shrink-0" />
              <div>
                <h3 className="font-bold uppercase tracking-wider text-sm">Premium Quality</h3>
                <p className="text-sm text-zinc-600">300 GSM Paper</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">Featured Collection</h2>
            <p className="text-base md:text-lg text-zinc-600">Handpicked designs for aesthetic spaces</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
                data-testid={`featured-product-${product.id}`}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-zinc-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">₹{product.price}</span>
                    <span className="text-xs uppercase tracking-widest font-medium text-zinc-500">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/shop"
              data-testid="view-all-products-btn"
              className="inline-flex items-center btn-outline"
            >
              VIEW ALL
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                comment: "Absolutely love the quality! The posters look even better in person. Transformed my room completely.",
                rating: 5
              },
              {
                name: "Arjun Mehta",
                comment: "Fast delivery and amazing packaging. The 300 GSM paper is top-notch. Will definitely order again!",
                rating: 5
              },
              {
                name: "Sneha Patel",
                comment: "Perfect for my aesthetic feed! Got so many compliments. The black and white prints are stunning.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 border-2 border-black bg-white">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-base mb-6 leading-relaxed">{testimonial.comment}</p>
                <p className="font-bold uppercase tracking-wider text-sm">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instagram Section */}
      <div className="py-24 bg-white border-t-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Instagram size={48} className="mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">@wallpix</h2>
            <p className="text-base md:text-lg text-zinc-600">Tag us to get featured</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1716477632783-91248c607b08?w=400",
              "https://images.unsplash.com/photo-1711886973298-45dbdf6fbc62?w=400",
              "https://images.unsplash.com/photo-1758293653945-037494d1ce04?w=400",
              "https://images.unsplash.com/photo-1772140067317-d4ab304486a6?w=400"
            ].map((img, index) => (
              <div key={index} className="aspect-square overflow-hidden border border-zinc-200 hover:border-black transition-colors">
                <img
                  src={img}
                  alt={`Instagram ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}