import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Search, Filter, X } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedSize, priceRange, searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedSize) {
      filtered = filtered.filter(p => p.sizes.includes(selectedSize));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setPriceRange([0, 5000]);
    setSearchQuery('');
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1, product.sizes[0]);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product_id) => {
    try {
      await addToWishlist(product_id);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="border-b-2 border-black py-12 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">Shop All Posters</h1>
          <p className="text-base md:text-lg text-zinc-600">Discover your perfect aesthetic</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Search & Filter Toggle */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search posters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-12"
              data-testid="search-input"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center justify-center py-3 px-6"
            data-testid="filter-toggle-btn"
          >
            <Filter size={20} className="mr-2" />
            FILTERS
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-6 border-2 border-black bg-zinc-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold uppercase tracking-wider">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm font-medium hover:underline"
                data-testid="clear-filters-btn"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-full"
                  data-testid="category-filter"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-3">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="input-field w-full"
                  data-testid="size-filter"
                >
                  <option value="">All Sizes</option>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A2">A2</option>
                  <option value="A1">A1</option>
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-3">
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                  data-testid="price-filter"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="mb-6">
          <p className="text-sm text-zinc-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-zinc-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card group" data-testid={`product-${product.id}`}>
                <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white font-bold uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                </Link>
                
                <div className="p-6">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg mb-2 hover:underline">{product.name}</h3>
                  </Link>
                  <p className="text-zinc-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">₹{product.price}</span>
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="p-2 hover:bg-zinc-100 transition-colors"
                      data-testid={`wishlist-btn-${product.id}`}
                    >
                      <Heart
                        size={20}
                        className={isInWishlist(product.id) ? 'fill-black' : ''}
                      />
                    </button>
                  </div>

                  {product.stock > 0 && (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full btn-primary py-3"
                      data-testid={`add-to-cart-btn-${product.id}`}
                    >
                      <ShoppingCart size={18} className="inline mr-2" />
                      ADD TO CART
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
