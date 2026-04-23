import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Phone, Mail, MapPin, Clock, Star, ArrowRight, 
  Smile, Award, Users, Heart, Shield,
  Instagram, Facebook, Youtube, Send,
  Calendar, ChevronDown
} from 'lucide-react';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', treatment: '', message: '' });
  const [activeService, setActiveService] = useState(0);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
    
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.5 });
      gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 0.8 });
      gsap.to('.float', { y: -10, duration: 2, ease: 'power1.inOut', repeat: -1, yoyo: true, stagger: 0.2 });
      gsap.from('.service-card', { scrollTrigger: { trigger: '.service-grid', start: 'top 80%' }, opacity: 0, y: 60, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
    });

    const interval = setInterval(() => setActiveService((prev) => (prev + 1) % services.length), 3000);

    return () => { ctx.revert(); clearInterval(interval); };
  }, []);

  const services = [
    { icon: Smile, title: 'Root Canal', desc: 'Advanced painless endodontic therapy', slug: 'root-canal', color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, title: 'Cosmetic', desc: 'Veneers, bonding & whitening', slug: 'cosmetic', color: 'from-pink-500 to-rose-500' },
    { icon: Award, title: 'Implants', desc: 'Permanent titanium implants', slug: 'implants', color: 'from-amber-500 to-orange-500' },
    { icon: Users, title: 'Braces', desc: 'Invisalign & orthodontics', slug: 'braces', color: 'from-purple-500 to-indigo-500' },
    { icon: Shield, title: 'Routine Care', desc: 'Cleaning & preventive care', slug: 'routine', color: 'from-green-500 to-emerald-500' },
    { icon: Star, title: 'Gum Care', desc: 'Periodontal & laser therapy', slug: 'gum', color: 'from-teal-500 to-cyan-500' },
  ];

  const testimonials = [
    { name: 'Rajeshwar', text: 'Very happy with root canal treatment. All covid safety measures in place. Highly recommended.', role: 'Patient', rating: 5, image: '👨‍💼' },
    { name: 'Kevien Uttankar', text: 'Very good and efficient tooth extraction. Doctor is soft spoken and attends all concerns patiently.', role: 'Patient', rating: 5, image: '👨‍💻' },
    { name: 'Rehan Chhabra', text: 'First visit for root canal. Staff is very friendly and made the process very comfortable.', role: 'Patient', rating: 5, image: '👨' },
  ];

  const faqs = [
    { q: 'How much does a dental filling cost?', a: 'Cost depends on material used and cavity size. Composite fillings are more durable.' },
    { q: 'How much does a root canal cost?', a: 'Costs vary based on tooth involved. Front teeth simpler than molars.' },
    { q: 'Is teeth whitening safe?', a: 'Yes, professional whitening is safe when done by a qualified dentist.' },
    { q: 'How often should I visit a dentist?', a: 'Every 6 months for routine checkups recommended.' },
    { q: 'What are cavity signs?', a: 'Tooth sensitivity, visible holes, chewing pain, or dark spots.' },
  ];

  const stats = [
    { number: '5000', label: 'Happy Patients', suffix: '+' },
    { number: '15', label: 'Years Experience', suffix: '+' },
    { number: '98', label: 'Success Rate', suffix: '%' },
    { number: '24', label: 'Expert Team', suffix: '+' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will contact you soon.');
    setContactForm({ name: '', email: '', phone: '', treatment: '', message: '' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
<div className="fixed inset-0 z-0">
        <img src="/background/bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/30" />
      </div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* HEADER */}
      <Header />

      {/* HERO */}
      <section ref={heroRef} className="pt-28 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img src="/hero/hero.jpg" alt="Dental Care" className="w-[80%] h-auto rounded-3xl shadow-2xl" />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-stone-800">
                Make Your Dream Smile<br />
                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">A Reality!</span>
              </h1>
              <p className="hero-subtitle text-xl sm:text-2xl mb-4 text-stone-600 font-semibold">
                Reclaim Your Smile With Us!
              </p>
              <p className="text-base sm:text-lg mb-8 text-stone-600 max-w-lg">
                Experience world-class dental care with cutting-edge technology.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button onClick={() => navigate('/register')} size="lg" className="shadow-lg shadow-teal-500/20">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-stone-600">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-teal-500" />
                  <span>Mon - Sat: 10AM – 7PM</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-teal-500" />
                  <span>Powai, Mumbai</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section ref={statsRef} className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-sm text-stone-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="treatments" ref={servicesRef} className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-stone-800">What Are You Looking For?</h2>
            <p className="text-lg text-stone-600">From routine care to complex procedures</p>
          </div>

          <div className="service-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }} className="service-card">
                <Link to={`/register?treatment=${service.slug}`} className="block p-8 rounded-3xl border transition-all bg-white/60 backdrop-blur-sm border-stone-200 hover:border-teal-400 hover:shadow-2xl">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 p-0.5 mb-6 float">
                    <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center">
                      <service.icon className="h-10 w-10 text-teal-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-stone-800">{service.title}</h3>
                  <p className="text-base text-stone-600">{service.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/30 backdrop-blur-sm border border-stone-200 p-10 sm:p-12 rounded-3xl">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-stone-800">About Our Clinic</h2>
              <p className="text-lg text-stone-600">
                Quality dental care that lasts a lifetime. We advise the best suitable treatments within budget.
                Equipped with latest & modern dental equipment for best care in least possible time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-stone-800">What Our Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -10 }} className="bg-white/30 backdrop-blur-sm border border-stone-200 p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl">{t.image}</div>
                  <div><div className="font-bold text-stone-800">{t.name}</div><div className="text-sm text-stone-600">{t.role}</div></div>
                </div>
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-stone-600 italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-stone-800">Get In Touch</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/30 backdrop-blur-sm border border-stone-200 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 text-stone-800">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input type="text" required placeholder="Name *" className="px-4 py-3 rounded-xl border bg-[#FBF0D9] border-stone-300" />
                  <input type="email" required placeholder="Email *" className="px-4 py-3 rounded-xl border bg-[#FBF0D9] border-stone-300" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <input type="tel" placeholder="Phone" className="px-4 py-3 rounded-xl border bg-[#FBF0D9] border-stone-300" />
                  <select className="px-4 py-3 rounded-xl border bg-[#FBF0D9] border-stone-300">
                    <option value="">Select Treatment</option>
                    <option value="pain">Pain Relief</option>
                    <option value="replacement">Teeth Replacement</option>
                  </select>
                </div>
                <textarea rows={4} placeholder="Message" className="w-full px-4 py-3 rounded-xl border bg-[#FBF0D9] border-stone-300" />
                <Button type="submit" size="lg" className="w-full">Send Message <Send className="h-5 w-5 ml-2" /></Button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/30 backdrop-blur-sm border border-stone-200 p-3 rounded-3xl overflow-hidden">
              <iframe src="https://www.google.com/maps?q=Powai+Mumbai&z=15&output=embed" width="100%" height="100%" style={{border:0, minHeight:'400px'}} allowFullScreen loading="lazy" className="rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-stone-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/30 backdrop-blur-sm border border-stone-200 rounded-2xl">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full p-5 flex items-center gap-4 text-left">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold bg-teal-100 text-teal-700">{i+1}</span>
                  <span className="font-semibold text-stone-800">{faq.q}</span>
                  <ArrowRight className={`h-5 w-5 text-teal-500 ml-auto ${faqOpen === i ? 'rotate-90' : ''}`} />
                </button>
                {faqOpen === i && <div className="px-5 pb-5 text-stone-600">{faq.a}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}