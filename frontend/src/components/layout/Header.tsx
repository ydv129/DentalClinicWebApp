import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, Stethoscope } from 'lucide-react';
import { AiOutlineWhatsApp } from 'react-icons/ai';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 left-3 right-3 z-50">
      <div className="absolute inset-0 bg-stone-800/90 backdrop-blur-md rounded-full shadow-lg" />
      <div className="max-w-7xl mx-auto px-4 py-2.5 relative">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div className="hidden xs:block">
              <span className="text-base font-bold text-white">DentalCare</span>
              <span className="text-xs block -mt-0.5 text-teal-400">Clinic</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {[
              { name: 'Treatments', href: '#treatments' },
              { name: 'About', href: '#about' },
              { name: 'Testimonials', href: '#testimonials' },
              { name: 'FAQ', href: '#faq' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-2.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 text-stone-200 hover:text-white hover:bg-white/10"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href="tel:+919819931333"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-teal-600 text-white hover:bg-teal-500"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Call</span>
            </a>
            <a
              href="https://wa.me/919819931333"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-500"
            >
              <AiOutlineWhatsApp className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 rounded-lg transition-all bg-white/10 text-white"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 py-2 bg-stone-700/90 backdrop-blur-sm rounded-lg">
            <nav className="flex flex-col">
              {['Treatments', 'About', 'Testimonials', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 px-4 text-sm font-medium text-stone-200 hover:text-white hover:bg-white/10"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex gap-2 px-4 pt-2 border-t border-stone-600">
              <a
                href="tel:+919819931333"
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-500"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a
                href="https://wa.me/919819931333"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-500"
              >
                <AiOutlineWhatsApp className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}