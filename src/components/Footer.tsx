import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/' + id;
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center justify-center md:justify-start space-x-2 text-white mb-6 group">
              <div className="bg-[#4F46E5] p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">Stitch <span className="text-indigo-400">Toppers</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering aspiring tailors with modern techniques and traditional craftsmanship. Master the art of tailoring from anywhere with Anju Somani.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Academy</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#courses" onClick={(e) => scrollToSection(e, 'courses')} className="hover:text-indigo-400 transition-colors cursor-pointer">All Courses</a></li>
              <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-indigo-400 transition-colors cursor-pointer">Our Method</a></li>
              <li><Link to="/success-stories" className="hover:text-indigo-400 transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/terms-of-service" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Connect</h4>
            <div className="flex justify-center md:justify-start mb-6">
              <a 
                href="https://wa.me/918660888419" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-xl transition-all hover:-translate-y-1 font-bold text-sm"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-indigo-400 bg-indigo-400/10 p-3 rounded-xl border border-indigo-400/20">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-bold">+91 86608 88419</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Stitch Toppers Tailoring Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
