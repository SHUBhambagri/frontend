import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-extrabold uppercase tracking-tighter mb-4">WALLPIX</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Premium aesthetic wall posters. HD print quality. 300 GSM paper.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  All Posters
                </Link>
              </li>
              <li>
                <Link to="/shop?featured=true" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/track-order" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-400 text-sm mb-4 md:mb-0">
            © 2026 WallPix. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}