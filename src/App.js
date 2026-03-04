import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";
import OrderSuccess from "./pages/OrderSuccess";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
