import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Package, ShoppingBag, Users, TrendingUp, Plus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    images: [''],
    category: '',
    sizes: ['A4'],
    stock: '',
    featured: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };

      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, data);
        toast.success('Product updated!');
      } else {
        await axios.post(`${API}/admin/products`, data);
        toast.success('Product created!');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', images: [''], category: '', sizes: ['A4'], stock: '', featured: false });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
    { label: 'Revenue', value: `₹${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-heading font-extrabold uppercase tracking-tighter">Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-outline px-6 py-3">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="border-2 border-black p-6">
              <stat.icon size={32} className="mb-4" />
              <p className="text-sm uppercase tracking-widest font-bold text-zinc-600">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold uppercase">Products</h2>
            <button onClick={() => setShowProductForm(true)} className="btn-primary px-6 py-3 flex items-center" data-testid="add-product-btn">
              <Plus size={20} className="mr-2" />
              Add Product
            </button>
          </div>

          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="border-2 border-black p-6 mb-8 space-y-4">
              <h3 className="text-xl font-bold uppercase">{editingProduct ? 'Edit' : 'Add'} Product</h3>
              <input type="text" placeholder="Product Name" value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required
                className="input-field w-full" data-testid="product-name-input" />
              <textarea placeholder="Description" value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required
                rows="3" className="input-field w-full" data-testid="product-description-input"></textarea>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price" value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required
                  className="input-field w-full" data-testid="product-price-input" />
                <input type="number" placeholder="Stock" value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required
                  className="input-field w-full" data-testid="product-stock-input" />
              </div>
              <input type="text" placeholder="Category" value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required
                className="input-field w-full" data-testid="product-category-input" />
              <input type="url" placeholder="Image URL" value={productForm.images[0]}
                onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })} required
                className="input-field w-full" data-testid="product-image-input" />
              <label className="flex items-center">
                <input type="checkbox" checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="mr-2" data-testid="product-featured-input" />
                <span className="font-bold uppercase text-sm">Featured Product</span>
              </label>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary" data-testid="save-product-btn">Save Product</button>
                <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                  className="btn-outline">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-zinc-200 p-4">
                <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-zinc-600 mb-2">{product.category}</p>
                <p className="font-bold mb-4">₹{product.price}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEditProduct(product)} className="btn-outline flex-1 py-2">Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase px-4 py-2">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-heading font-bold uppercase mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 10).map((order) => (
              <div key={order.id} className="border-2 border-black p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{order.order_number}</p>
                    <p className="text-sm text-zinc-600">{order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.total}</p>
                    <p className="text-sm text-zinc-600">{order.payment_status} / {order.shipping_status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
