'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: '#', 
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      href: '#', 
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: '#', 
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.989v-10.131c0-7.88-8.922-7.593-11.02-3.711v-2.159z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      href: '#', 
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient text-white pt-20 pb-10">
      <div className="section-container">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Hiflow</h2>
            <p className="text-blue-50/70 leading-relaxed max-w-xs">
              {t.landing.footer.tagline}
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">{t.landing.footer.transport}</h3>
            <ul className="space-y-4 text-blue-50/70">
              <li><Link href="#" className="hover:text-white transition-colors">{t.landing.solutions.badge}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.common.becomeDriver}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Transportation with professional driver</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">{t.landing.footer.services}</h3>
            <ul className="space-y-4 text-blue-50/70">
              <li><Link href="#" className="hover:text-white transition-colors">Getting started with the vehicle</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Washing the vehicle</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Charging your electric vehicle</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Make an appointment</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Transport tracking</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">{t.landing.footer.resources}</h3>
            <ul className="space-y-4 text-blue-50/70">
              <li><Link href="#" className="hover:text-white transition-colors">Careers at Hiflow</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.common.whoAreWe}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.landing.contact.title}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-sm text-blue-50/60">
            <span>© {currentYear} Hiflow. {t.landing.footer.rights}</span>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-white transition-colors font-medium">UGC</Link>
              <Link href="#" className="hover:text-white transition-colors font-medium">GVC</Link>
              <Link href="#" className="hover:text-white transition-colors font-medium">{t.landing.footer.legal}</Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <Link 
                key={index} 
                href={social.href} 
                aria-label={social.name}
                className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
