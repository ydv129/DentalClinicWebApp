import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Stethoscope } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 relative z-20">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-t border-stone-200/50" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-stone-800">DentalCare</span>
                <span className="text-xs block -mt-0.5 text-teal-600">Clinic</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6 text-stone-600">
              Quality dental care that lasts a lifetime. We're committed to providing exceptional oral healthcare for patients of all ages.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/80 shadow-md text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/80 shadow-md text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/80 shadow-md text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-stone-800">Treatments</h4>
            <div className="space-y-2">
              {['Root Canal', 'Cosmetic Dentistry', 'Dental Implants', 'Braces', 'Routine Care', 'Gum Treatment'].map((item) => (
                <a key={item} href="#treatments" className="block text-sm text-stone-600 hover:text-teal-600 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-stone-800">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <a href="tel:+919819931333" className="flex items-center gap-2 text-stone-600 hover:text-teal-600">
                <Phone className="h-4 w-4 text-teal-500" />
                <span>+91 981 9931 333</span>
              </a>
              <a href="mailto:info@dentalcare.com" className="flex items-center gap-2 text-stone-600 hover:text-teal-600">
                <Mail className="h-4 w-4 text-teal-500" />
                <span>info@dentalcare.com</span>
              </a>
              <div className="flex items-center gap-2 text-stone-600">
                <Clock className="h-4 w-4 text-teal-500" />
                <span>Mon - Sat: 10AM - 7PM</span>
              </div>
              <div className="flex items-start gap-2 text-stone-600">
                <MapPin className="h-4 w-4 text-teal-500 mt-0.5" />
                <span>Powai, Mumbai 400076</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-200/50 text-center text-sm text-stone-500">
          © 2026 DentalCare Clinic. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}