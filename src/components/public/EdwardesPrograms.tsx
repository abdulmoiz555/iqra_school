import React from 'react';
import {
  GraduationCap,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

export const EdwardesPrograms: React.FC = () => {
  return (
    <section id="programs" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
            Academic Programs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured educational pathways accredited under BISE Mardan standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. College Wing */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-sm inline-block">
                College Wing (HSSC)
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900">
                F.Sc & ICS Programs
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-Medical (Biology, Chemistry, Physics), Pre-Engineering (Higher Math, Physics, Chemistry), and ICS (Computer Science).
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>MDCAT & ETEA Entrance Exam Focus</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Modern Computer & Science Laboratories</span>
              </li>
            </ul>
          </div>

          {/* 2. Secondary Science */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-sm inline-block">
                Secondary Wing (SSC)
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Matric Science (9th & 10th)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Foundational sciences in Biology and Computer Science groups, ensuring solid analytical and board exam performance.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>100% Board Examination Pass Ratio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Dedicated Class Incharge Mentorship</span>
              </li>
            </ul>
          </div>

          {/* 3. Junior & Middle Wing */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-sm inline-block">
                Primary & Middle
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Play Group to Grade 8
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Holistic foundational education emphasizing English, Arithmetic, General Science, Urdu, and Quranic moral grooming.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Phonics & Activity-Based Learning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Safe Campus & Caring Environment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
