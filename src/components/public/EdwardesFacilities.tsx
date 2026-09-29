import React from 'react';
import {
  FlaskConical,
  Laptop,
  BookOpen,
  Bus,
  Trophy,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const EdwardesFacilities: React.FC = () => {
  const facilities = [
    {
      icon: FlaskConical,
      color: 'text-rose-600 bg-rose-50',
      title: 'Physics, Chemistry & Bio Labs',
      description: 'Fully furnished science laboratories with precision microscopes, chemical reagents, and test apparatus complying with BISE Mardan practical syllabi.',
    },
    {
      icon: Laptop,
      color: 'text-blue-600 bg-blue-50',
      title: 'Air-Conditioned Computer Lab',
      description: 'Core i7 computer workstations connected to high-speed fiber internet, providing practical coding environments for C++, web development, and digital literacy.',
    },
    {
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50',
      title: 'Central Academic Library',
      description: 'Over 6,000 reference volumes, past board examination papers, encyclopedia sets, and a peaceful reading atmosphere for study and research.',
    },
    {
      icon: Bus,
      color: 'text-emerald-600 bg-emerald-50',
      title: 'College Transport Fleet',
      description: 'Safe, punctual buses and vans providing pick-and-drop services spanning Garhi Kapura, Mardan city, and surrounding villages with verified drivers.',
    },
    {
      icon: Trophy,
      color: 'text-indigo-600 bg-indigo-50',
      title: 'Sports Grounds & Pavilion',
      description: 'Lush campus grounds equipped for cricket, football, badminton, and annual athletics championships fostering teamwork and physical wellness.',
    },
    {
      icon: ShieldCheck,
      color: 'text-cyan-600 bg-cyan-50',
      title: 'CCTV Surveillance & Security',
      description: 'Round-the-clock gated security, boundary security protocols, and 24/7 CCTV surveillance ensuring a completely safe campus for male and female students.',
    },
  ];

  return (
    <section id="facilities" className="py-16 bg-[#FAF9F6] border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            CAMPUS INFRASTRUCTURE & AMENITIES
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            Collegiate Facilities & Learning Resources
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Providing modern facilities that empower scholars to achieve distinction in academics, technology, and sports.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className={`h-12 w-12 rounded-xl ${fac.color} flex items-center justify-center font-bold`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {fac.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {fac.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
