import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes[0]);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity, selectedSize);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    try {
      await axios.post(`${API}/reviews/create`, {
        product_id: product.id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <Link to="/shop" className="inline-flex items-center text-sm font-medium mb-8 hover:underline" data-testid="back-to-shop-link">
          <ChevronLeft size={16} className="mr-1" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-4">
              {product.images.map((img, idx) => (
                <Zoom key={idx}>
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full border border-zinc-200" />
                </Zoom>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-4" data-testid="product-name">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < avgRating ? 'fill-black' : 'fill-zinc-300'} />
                ))}
              </div>
              <span className="text-sm text-zinc-600">({reviews.length} reviews)</span>
            </div>

            <p className="text-3xl font-bold mb-6" data-testid="product-price">₹{product.price}</p>
            <p className="text-base leading-relaxed text-zinc-700 mb-8">{product.description}</p>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest font-bold mb-3">Size</label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 font-bold uppercase tracking-wider transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-zinc-300 hover:border-black'
                    }`}
                    data-testid={`size-option-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs uppercase tracking-widest font-bold mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border-2 border-zinc-300 hover:border-black font-bold"
                  data-testid="quantity-decrease-btn"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold" data-testid="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border-2 border-zinc-300 hover:border-black font-bold"
                  data-testid="quantity-increase-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart size={18} className="inline mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="px-6 py-4 border-2 border-black hover:bg-black hover:text-white transition-all"
                data-testid="add-to-wishlist-btn"
              >
                <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h3 className="font-bold uppercase tracking-wider text-sm mb-4">Product Details</h3>
              <ul className="space-y-2 text-sm text-zinc-700">
                <li>• Premium 300 GSM Paper</li>
                <li>• HD Print Quality</li>
                <li>• Vibrant Colors</li>
                <li>• Made to Order</li>
                <li>• Ships in 2-3 Business Days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t-2 border-black pt-12">
          <h2 className="text-3xl font-heading font-bold uppercase mb-8">Customer Reviews</h2>

          {user && (
            <form onSubmit={handleSubmitReview} className="mb-12 p-6 border-2 border-black bg-zinc-50">
              <h3 className="font-bold uppercase tracking-wider text-sm mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                      data-testid={`rating-star-${star}`}
                    >
                      <Star size={24} className={star <= newReview.rating ? 'fill-black' : 'fill-zinc-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  rows="4"
                  className="input-field w-full"
                  data-testid="review-comment-input"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" data-testid="submit-review-btn">Submit Review</button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 border border-zinc-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">{review.user_name}</span>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-black" />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
