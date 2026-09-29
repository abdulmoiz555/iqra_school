import React, { useState } from 'react';
import {
  Compass,
  Phone,
  Mail,
  ExternalLink,
  LogIn,
  Menu,
  X,
  Award,
} from 'lucide-react';

interface EdwardesHeaderProps {
  schoolName: string;
  activeSession: string;
  onNavigateToSignIn: () => void;
  onEnterPortalDirectly: () => void;
}

export const EdwardesHeader: React.FC<EdwardesHeaderProps> = ({
  schoolName,
  activeSession,
  onNavigateToSignIn,
  onEnterPortalDirectly,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 1. Slim, Clean Contact Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Compass className="h-3 w-3 text-amber-400" />
              <span>Garhi Kapura, Mardan</span>
            </span>
            <span className="text-slate-600">·</span>
            <a href="tel:+923459840192" className="hover:text-white transition-colors">
              +92 345 9840192
            </a>
            <span className="text-slate-600">·</span>
            <a href="mailto:iqra.gk1994@gmail.com" className="hover:text-white transition-colors hidden md:inline">
              iqra.gk1994@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://web.facebook.com/profile.php?id=100057113664245"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white text-slate-400 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Facebook</span>
            </a>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-medium">Session {activeSession}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Sleek Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/iqra_logo.jpg"
            alt="Logo"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg object-contain border border-slate-200 p-0.5 bg-white shadow-2xs"
            onError={(e) => {
              e.currentTarget.src = '/public/iqra_logo.jpg';
            }}
          />
          <div>
            <div className="font-serif font-black text-sm sm:text-base text-slate-900 tracking-tight leading-none uppercase">
              {schoolName || 'Iqra School & College'}
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
              Garhi Kapura Mardan · Estd. 1994 · BISE Mardan
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#home" className="hover:text-slate-900 transition-colors">
            Home
          </a>
          <a href="#principal" className="hover:text-slate-900 transition-colors">
            Principal
          </a>
          <a href="#notices" className="hover:text-slate-900 transition-colors">
            Notices
          </a>
          <a href="#awards" className="hover:text-slate-900 transition-colors text-amber-700 flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>Talent Awards</span>
          </a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToSignIn}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-2xs transition-colors cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5 text-amber-400" />
            <span>Portal Login</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 text-xs font-semibold text-slate-700 shadow-md">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-2 hover:bg-slate-50 rounded-md"
          >
            Home
          </a>
          <a
            href="#principal"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-2 hover:bg-slate-50 rounded-md"
          >
            Principal's Message (Sir Imran)
          </a>
          <a
            href="#notices"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-2 hover:bg-slate-50 rounded-md"
          >
            Notice Board & Circulars
          </a>
          <a
            href="#awards"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-2 hover:bg-slate-50 rounded-md text-amber-700 font-bold"
          >
            #IQRA_TALENT_AWARD_CEREMONY 🏆
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-2 hover:bg-slate-50 rounded-md"
          >
            Campus Contact
          </a>
        </div>
      )}
    </header>
  );
};
