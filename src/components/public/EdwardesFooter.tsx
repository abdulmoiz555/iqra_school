import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  LogIn,
} from 'lucide-react';

interface EdwardesFooterProps {
  schoolName: string;
  onNavigateToSignIn: () => void;
}

export const EdwardesFooter: React.FC<EdwardesFooterProps> = ({
  schoolName,
  onNavigateToSignIn,
}) => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Identity */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/iqra_logo.jpg"
                alt="Logo"
                className="h-9 w-9 rounded-md object-contain bg-white p-0.5 border border-slate-700"
                onError={(e) => {
                  e.currentTarget.src = '/public/iqra_logo.jpg';
                }}
              />
              <span className="font-serif font-bold text-white text-sm">
                {schoolName || 'Iqra School and College'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Estd. 1994 · Registered with BISE Mardan. Committed to academic distinction and ethical character grooming in Garhi Kapura Mardan.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-[11px]">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Contact & Location
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>Main Bazaar Road, Garhi Kapura, Mardan, KP, Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <a href="tel:+923459840192" className="hover:text-white transition-colors">
                +92 345 9840192
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <a href="mailto:iqra.gk1994@gmail.com" className="hover:text-white transition-colors">
                iqra.gk1994@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <a
                href="https://web.facebook.com/profile.php?id=100057113664245"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors text-slate-300"
              >
                Official Facebook Page
              </a>
            </div>
          </div>

          {/* Quick Links & Portal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              ERP Portal
            </h4>
            <p className="text-[11px] text-slate-400">
              Authorized access for administration, teachers, and enrolled students.
            </p>
            <button
              onClick={onNavigateToSignIn}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 text-xs transition-colors cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5 text-amber-400" />
              <span>Portal Sign In</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>Iqra School and College Garhi Kapura Mardan</strong>. All rights reserved.
          </div>
          <div>
            Affiliated with BISE Mardan · Reg. #IQRA-GK-1994-01
          </div>
        </div>
      </div>
    </footer>
  );
};
