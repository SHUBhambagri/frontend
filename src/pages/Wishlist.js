import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item.product_id, 1, item.product.sizes[0]);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-12">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 border-2 border-black">
            <Heart size={64} className="mx-auto mb-6 text-zinc-400" />
            <p className="text-xl text-zinc-600 mb-6">Your wishlist is empty</p>
            <Link to="/shop" className="inline-block btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="product-card">
                <div className="relative">
                  <Link to={`/product/${item.product_id}`} className="block aspect-[3/4] overflow-hidden">
                    <img src={item.product.images[0]} alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="absolute top-2 right-2 p-2 bg-white border border-black hover:bg-black hover:text-white transition-colors"
                    data-testid={`remove-wishlist-${item.product_id}`}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-bold text-lg mb-2 hover:underline">{item.product.name}</h3>
                  </Link>
                  <p className="text-2xl font-bold mb-4">₹{item.product.price}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full btn-primary py-3"
                    data-testid={`wishlist-add-to-cart-${item.product_id}`}
                  >
                    <ShoppingCart size={16} className="inline mr-2" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
