import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, Stethoscope } from 'lucide-react';
import { AiOutlineWhatsApp } from 'react-icons/ai';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 left-3 right-3 z-50">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full shadow-lg" />
      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-stone-900">DentalCare</span>
              <span className="text-xs block -mt-0.5 text-teal-700">Clinic</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { name: 'Treatments', href: '#treatments' },
              { name: 'About', href: '#about' },
              { name: 'Testimonials', href: '#testimonials' },
              { name: 'FAQ', href: '#faq' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 text-stone-900 hover:text-teal-700 hover:bg-white/50"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919819931333"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-teal-600 text-white hover:bg-teal-700"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call</span>
            </a>
            <a
              href="https://wa.me/919819931333"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700"
            >
              <AiOutlineWhatsApp className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg transition-all bg-white/50 text-stone-900"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-2 py-2 bg-white/80 backdrop-blur-sm rounded-lg">
            {['Treatments', 'About', 'Testimonials', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-4 text-sm font-medium text-stone-900 hover:text-teal-700 hover:bg-white/50"
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}