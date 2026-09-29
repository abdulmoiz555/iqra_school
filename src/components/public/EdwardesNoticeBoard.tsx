import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  ChevronRight,
  Pin,
  X,
} from 'lucide-react';

export const EdwardesNoticeBoard: React.FC = () => {
  const [activeModalNotice, setActiveModalNotice] = useState<any | null>(null);

  const notices = [
    {
      id: 'n-1',
      date: 'Sep 28, 2026',
      title: 'Admissions Open for Session 2026–2027 (F.Sc, ICS & Matric Wings)',
      excerpt: 'Online registration and prospectus issuance for Pre-Medical, Pre-Engineering, Computer Science, and Secondary Science has officially begun. Guaranteed sibling concessions apply.',
      details: 'Applications are invited from eligible candidates for admission into Class 9th, 10th (Matric Science), F.Sc Pre-Medical, Pre-Engineering, and ICS for Session 2026–2027. Prospectus and admission forms can be obtained from the college admissions office or submitted online. Parents with multiple enrolled children will automatically receive sibling tuition concessions (25% for 2nd child, 50% for 3rd+ child).',
      signedBy: 'Admissions Committee & Principal Sir Imran',
    },
    {
      id: 'n-2',
      date: 'Sep 24, 2026',
      title: '#IQRA_TALENT_AWARD_CEREMONY 🏆 Medals & Shields Distributed',
      excerpt: 'Annual award distribution ceremony successfully held under the patronage of Principal Sir Imran. Board position holders and high-scoring students were awarded commemorative honors.',
      details: 'The administration of Iqra School and College Garhi Kapura Mardan congratulates all position holders, gold medalists, and distinction achievers who were honored during the #IQRA_TALENT_AWARD_CEREMONY 🏆. Official award photographs and event highlights have been published in the gallery section.',
      signedBy: 'Office of the Principal, Sir Imran',
    },
    {
      id: 'n-3',
      date: 'Sep 18, 2026',
      title: 'Institutional Code of Conduct & Respectful Campus Environment',
      excerpt: 'Notice regarding mandatory uniform adherence, minimum 80% attendance requirement for BISE board exams, and mutual respect among students.',
      details: 'In accordance with college regulations, all students must maintain at least 80% attendance to be eligible for BISE Mardan board examinations. Teachers and class incharges record roll-call attendance daily.',
      signedBy: 'Discipline Committee',
    },
    {
      id: 'n-4',
      date: 'Sep 01, 2026',
      title: 'Monthly Fee Challan Vouchers Ready with Official Security Watermark',
      excerpt: 'Standardized Half-A4 fee vouchers for the billing cycle are ready for collection with verified school logo watermark and sibling percentage discount notes.',
      details: 'Fee challan vouchers have been generated. Each voucher is printed in the standardized Half-A4 duplicate format with the official Iqra School crest watermark, contact details, and sibling percentage discounts.',
      signedBy: 'Accounts Department',
    },
  ];

  return (
    <section id="notices" className="py-12 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              Notice Board & Announcements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official circulars and academic notices for students and parents
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">BISE Mardan Affiliated</span>
        </div>

        {/* Clean, Simple Notice List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveModalNotice(notice)}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {notice.date}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-900 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                  {notice.excerpt}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-blue-900">
                <span>Read details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Modal */}
      {activeModalNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeModalNotice.date}
                </span>
                <h3 className="font-serif font-black text-base sm:text-lg text-slate-900 mt-1">
                  {activeModalNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeModalNotice.details}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{activeModalNotice.signedBy}</span>
              <button
                onClick={() => setActiveModalNotice(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
