import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tighter" data-testid="logo-link">
              WALLPIX
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/shop" className="font-bold uppercase tracking-wider text-sm hover:underline" data-testid="nav-shop-link">
                Shop
              </Link>
              <Link to="/about" className="font-bold uppercase tracking-wider text-sm hover:underline" data-testid="nav-about-link">
                About
              </Link>
              <Link to="/contact" className="font-bold uppercase tracking-wider text-sm hover:underline" data-testid="nav-contact-link">
                Contact
              </Link>
              <Link to="/track-order" className="font-bold uppercase tracking-wider text-sm hover:underline" data-testid="nav-track-link">
                Track Order
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {user && (
                <Link to="/wishlist" className="hidden md:block p-2 hover:bg-zinc-100 transition-colors" data-testid="nav-wishlist-link">
                  <Heart size={20} />
                </Link>
              )}
              
              <button
                onClick={() => setShowCartDrawer(true)}
                className="relative p-2 hover:bg-zinc-100 transition-colors"
                data-testid="nav-cart-btn"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative hidden md:block">
                <button
                  onClick={() => user ? setShowUserMenu(!showUserMenu) : setShowAuthModal(true)}
                  className="p-2 hover:bg-zinc-100 transition-colors"
                  data-testid="nav-user-btn"
                >
                  <User size={20} />
                </button>
                
                {showUserMenu && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black" data-testid="user-menu">
                    <Link to="/my-orders" className="block px-4 py-3 hover:bg-zinc-100 font-medium" data-testid="my-orders-link">
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-100 font-medium"
                      data-testid="logout-btn"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2"
                data-testid="mobile-menu-btn"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t-2 border-black bg-white" data-testid="mobile-menu">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/shop"
                className="block text-3xl font-heading font-bold uppercase"
                onClick={() => setShowMobileMenu(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block text-3xl font-heading font-bold uppercase"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-3xl font-heading font-bold uppercase"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
              <Link
                to="/track-order"
                className="block text-3xl font-heading font-bold uppercase"
                onClick={() => setShowMobileMenu(false)}
              >
                Track Order
              </Link>
              {user && (
                <Link
                  to="/wishlist"
                  className="block text-3xl font-heading font-bold uppercase"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Wishlist
                </Link>
              )}
              {user && (
                <Link
                  to="/my-orders"
                  className="block text-3xl font-heading font-bold uppercase"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Orders
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="block text-3xl font-heading font-bold uppercase text-left"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="block text-3xl font-heading font-bold uppercase text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </>
  );
}