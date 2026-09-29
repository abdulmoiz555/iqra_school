import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ChevronRight,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { EdwardesHeader } from './EdwardesHeader';
import { EdwardesNoticeBoard } from './EdwardesNoticeBoard';
import { EdwardesFooter } from './EdwardesFooter';

interface IndexPageProps {
  onNavigateToSignIn: () => void;
  onEnterPortalDirectly: () => void;
}

export const IndexPage: React.FC<IndexPageProps> = ({
  onNavigateToSignIn,
  onEnterPortalDirectly,
}) => {
  const { settings } = useApp();

  // Selected Image for Lightbox
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    caption: string;
  } | null>(null);

  // Selected Talent Award Photos
  const talentAwardImages = [
    {
      src: '/award_1.jpg',
      title: 'Stage Presentation & Topper Felicitations',
      caption: 'Honorary ceremony awarding distinction shields and gold medals to board position holders.',
    },
    {
      src: '/award_2.jpg',
      title: 'Shields & Medals by Principal Sir Imran',
      caption: 'Sir Imran presenting academic distinction trophies to high achievers in presence of faculty.',
    },
    {
      src: '/award_3.jpg',
      title: 'Academic Distinction & Board Achievers',
      caption: 'Group photo of high-scoring candidates receiving merit scholarship certificates.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased font-sans selection:bg-slate-800 selection:text-white">
      {/* 1. Sleek, Uncrowded Header */}
      <EdwardesHeader
        schoolName={settings.schoolName || 'Iqra School and College Garhi Kapura Mardan'}
        activeSession={settings.activeSession}
        onNavigateToSignIn={onNavigateToSignIn}
        onEnterPortalDirectly={onEnterPortalDirectly}
      />

      {/* 2. Calm, Spacious Hero Banner */}
      <section id="home" className="relative bg-slate-900 text-white min-h-[420px] sm:min-h-[460px] flex items-center overflow-hidden">
        <img
          src="/award_1.jpg"
          alt="Campus Hero"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xs">
            <Star className="h-3 w-3 text-amber-400" />
            <span>Excellence in Education since 1994</span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-white max-w-2xl leading-tight">
            Nurturing Knowledge, Character & Leadership
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Welcome to Iqra School and College Garhi Kapura Mardan. Providing high-standard science matriculation and intermediate collegiate education under BISE Mardan.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#notices"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              Campus Notices
            </a>
            <button
              onClick={onNavigateToSignIn}
              className="rounded-lg border border-slate-400 bg-white/10 hover:bg-white text-white hover:text-slate-950 px-5 py-2.5 text-xs sm:text-sm font-bold backdrop-blur-xs transition-all cursor-pointer"
            >
              Portal Login
            </button>
          </div>
        </div>
      </section>

      {/* 3. Simple Highlights Strip (Uncluttered) */}
      <section className="border-b border-slate-200 bg-slate-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-0.5">
              <div className="font-serif font-black text-xl sm:text-2xl text-slate-900">30+ Years</div>
              <div className="text-xs text-slate-500">Established in 1994</div>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-black text-xl sm:text-2xl text-slate-900">100%</div>
              <div className="text-xs text-slate-500">Board Pass Record</div>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-black text-xl sm:text-2xl text-slate-900">BISE Mardan</div>
              <div className="text-xs text-slate-500">Official Affiliation</div>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-black text-xl sm:text-2xl text-slate-900">Garhi Kapura</div>
              <div className="text-xs text-slate-500">Mardan, KP Campus</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Principal's Message (Sir Imran) */}
      <section id="principal" className="py-14 bg-white border-b border-slate-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative max-w-[240px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src="/award_2.jpg"
                  alt="Principal Sir Imran"
                  className="w-full aspect-4/5 object-cover"
                />
                <div className="p-3 bg-slate-900 text-white text-center">
                  <h3 className="font-serif font-bold text-sm text-white">Sir Imran</h3>
                  <p className="text-[11px] text-slate-400">Principal & Head of Institution</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Leadership Message
              </span>
              <h2 className="font-serif font-black text-2xl text-slate-900">
                Welcome to Iqra School and College
              </h2>
              <blockquote className="border-l-3 border-amber-500 pl-4 py-1 italic font-serif text-sm text-slate-600">
                "Our mission is to combine rigorous academic preparation with moral integrity and holistic character building."
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                At Iqra School and College Garhi Kapura Mardan, we cultivate an environment where students excel in board examinations while developing ethical responsibility, discipline, and lifelong learning skills. We take pride in our position holders, gold medalists, and distinguished alumni who contribute actively to society.
              </p>
              <div className="pt-1 text-xs text-slate-500">
                Contact Office: <a href="mailto:iqra.gk1994@gmail.com" className="text-slate-800 font-medium underline">iqra.gk1994@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Notice Board (Clean & Uncrowded) */}
      <EdwardesNoticeBoard />

      {/* 6. #IQRA_TALENT_AWARD_CEREMONY 🏆 Showcase (Clean Photo Grid) */}
      <section id="awards" className="py-14 bg-white border-b border-slate-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Annual Achievements
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-0.5">
                #IQRA_TALENT_AWARD_CEREMONY 🏆
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Felicitating BISE Mardan board position holders, gold medalists, and distinction achievers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {talentAwardImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-sm font-medium">
                    Award Ceremony
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <h3 className="font-serif font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Clean Footer */}
      <EdwardesFooter
        schoolName={settings.schoolName || 'Iqra School and College Garhi Kapura Mardan'}
        onNavigateToSignIn={onNavigateToSignIn}
      />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full aspect-16/10 object-contain bg-black"
            />

            <div className="p-4 bg-slate-900 text-white space-y-1">
              <h3 className="font-serif font-bold text-sm text-white">{selectedImage.title}</h3>
              <p className="text-xs text-slate-300">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
