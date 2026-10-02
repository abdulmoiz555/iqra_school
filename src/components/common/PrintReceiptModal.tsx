import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FeePayment } from '../../types';
import {
  X,
  Printer,
  FileText,
  Copy,
  CheckCircle,
  Building,
  Calendar,
  AlertTriangle,
  QrCode,
  Scissors,
  ExternalLink
} from 'lucide-react';
import {
  printReceiptViaIframe,
  generateHalfA4VoucherHtml,
  generateThermalPosSlipHtml,
  numberToWords
} from '../../utils/printReceiptHelper';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: FeePayment | null;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  const { settings, students, classes, sections, parents, feeTypes } = useApp();
  // Default to Half A4 Split (2 half-A4 vouchers on 1 A4 page)
  const [receiptFormat, setReceiptFormat] = useState<'half-a4-split' | 'half-a4-single' | 'dual' | 'thermal'>('half-a4-split');
  const [showPaidStamp, setShowPaidStamp] = useState(true);

  // Manage print class on body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('print-active');
    }
    return () => {
      document.body.classList.remove('print-active');
    };
  }, [isOpen]);

  if (!isOpen || !payment) return null;

  const student = students.find((s) => s.id === payment.studentId);
  const cls = student ? classes.find((c) => c.id === student.classId) : null;
  const sec = student ? sections.find((s) => s.id === student.sectionId) : null;
  const parent = student ? parents.find((p) => p.id === student.parentId) : null;

  // Compute late fee calculation
  const defaultLateFine = payment.fineAmount > 0 ? payment.fineAmount : 300;
  const payableWithinDueDate = payment.totalAmount;
  const payableAfterDueDate = payment.totalAmount + defaultLateFine;

  // Calculation in words
  const amountInWords = numberToWords(payment.paidAmount > 0 ? payment.paidAmount : payableWithinDueDate);

  const printHalfA4 = () => {
    setReceiptFormat('half-a4-split');
    const html = generateHalfA4VoucherHtml({
      payment,
      student,
      cls,
      sec,
      parent,
      settings,
      feeTypes,
    });
    printReceiptViaIframe(html);
  };

  const printPosSlip = () => {
    setReceiptFormat('thermal');
    const html = generateThermalPosSlipHtml({
      payment,
      student,
      cls,
      sec,
      parent,
      settings,
      feeTypes,
    });
    printReceiptViaIframe(html);
  };

  const handlePrint = () => {
    if (receiptFormat === 'thermal') {
      printPosSlip();
    } else {
      printHalfA4();
    }
  };

  // Robust Standalone Print View (ensures 100% reliability in iframe preview)
  const handleOpenPrintWindow = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    const studentFullName = student ? `${student.firstName} ${student.lastName}` : 'N/A';
    const fatherName = parent?.fatherName || parent?.guardianName || 'Muhammad Arshad Khan';
    const classNameStr = `${cls?.name || 'Class 9'} (${sec?.name || 'A'})`;
    const logoSrc = window.location.origin + (settings.logoUrl || '/iqra_logo.jpg');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Challan - ${studentFullName} - ${settings.schoolName}</title>
        <meta charset="utf-8">
        <style>
          @page { size: A4 portrait; margin: 4mm 6mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          body { background: #fff; color: #111; padding: 4px; }
          .half-slip {
            position: relative;
            border: 2px solid #111;
            padding: 8px 12px;
            margin-bottom: 8px;
            height: 136mm;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 250px;
            height: 250px;
            opacity: 0.08;
            pointer-events: none;
            z-index: 0;
          }
          .content { position: relative; z-index: 2; }
          .header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 4px; margin-bottom: 4px; }
          .school-info { display: flex; align-items: center; gap: 8px; }
          .school-logo { width: 44px; height: 44px; object-fit: contain; }
          .school-name { font-size: 13px; font-weight: 900; text-transform: uppercase; }
          .school-sub { font-size: 8px; color: #444; }
          .banner { background: #111; color: #fff; padding: 2px 6px; font-size: 9px; font-weight: bold; display: flex; justify-content: space-between; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 8.5px; }
          th, td { padding: 2px 5px; }
          .info-table td { border: 1px solid #ccc; }
          .info-label { background: #f3f3f3; font-weight: 600; width: 85px; }
          .fee-table { border: 1px solid #333; margin-top: 4px; }
          .fee-table th { background: #222; color: #fff; font-size: 8px; }
          .fee-table td { border-bottom: 1px solid #eee; }
          .boxes { display: flex; gap: 6px; margin-top: 4px; }
          .box { flex: 1; border: 1.5px solid #059669; background: #ecfdf5; padding: 4px; text-align: center; border-radius: 2px; }
          .box-red { border-color: #dc2626; background: #fef2f2; }
          .box-title { font-size: 7.5px; font-weight: bold; text-transform: uppercase; }
          .box-amt { font-size: 13px; font-weight: 900; }
          .words { font-size: 8px; background: #f8f8f8; padding: 3px; border: 1px solid #ddd; margin-top: 4px; font-style: italic; }
          .cut-line { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 4px 0; font-size: 8px; font-family: monospace; color: #666; border-top: 1.5px dashed #666; padding-top: 2px; }
          .sig-row { display: flex; justify-content: space-between; text-align: center; font-size: 7.5px; border-top: 1px dashed #999; padding-top: 4px; margin-top: 4px; }
          .stamp-paid { border: 1.5px solid #059669; color: #059669; font-weight: bold; font-size: 8px; padding: 2px 6px; display: inline-block; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <!-- Top Half: School Copy -->
        <div class="half-slip">
          <img src="${logoSrc}" class="watermark" alt="Watermark" />
          <div class="content">
            <div class="header-row">
              <div class="school-info">
                <img src="${logoSrc}" class="school-logo" alt="Logo" />
                <div>
                  <div class="school-name">${settings.schoolName}</div>
                  <div class="school-sub">Main Campus · Garhi Kapura, Mardan · Ph: ${settings.phone}</div>
                  <div class="school-sub">Email: ${settings.email || 'iqra.gk1994@gmail.com'} · FB: fb.com/iqra.gk1994 · Session: ${settings.activeSession}</div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="border: 1px solid #111; padding: 2px 6px; font-size: 8px; font-weight: bold; display: inline-block;">SCHOOL / ACCOUNTS COPY</div>
                <div style="font-size: 9px; font-weight: bold; margin-top: 2px;">Challan #: ${payment.receiptNumber}</div>
                <div style="font-size: 8px; font-family: monospace; font-weight: bold; color: #1e3a8a;">Tracking #: ${payment.trackingNumber || `TRK-2026-${payment.receiptNumber.slice(-4)}`}</div>
                <div style="font-size: 8px; color: #666;">Date: ${payment.date}</div>
              </div>
            </div>

            <div class="banner">
              <span>MONTHLY FEE CHALLAN / VOUCHER (HALF A4)</span>
              <span>Month: ${payment.month} ${payment.year} | Due Date: 10/${payment.month.slice(0, 3)}/${payment.year}</span>
            </div>

            <table class="info-table">
              <tr>
                <td class="info-label">Student Name:</td>
                <td><strong>${studentFullName}</strong></td>
                <td class="info-label">Class & Sec:</td>
                <td><strong>${classNameStr} (Roll: ${student?.rollNumber || '101'})</strong></td>
              </tr>
              <tr>
                <td class="info-label">Father's Name:</td>
                <td>${fatherName}</td>
                <td class="info-label">Admission #:</td>
                <td>${student?.admissionNumber || 'IQ-2024-001'}</td>
              </tr>
            </table>

            <table class="fee-table">
              <thead>
                <tr>
                  <th style="width: 25px; text-align: center;">#</th>
                  <th style="text-align: left;">Particulars / Fee Head</th>
                  <th style="text-align: right; width: 100px;">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                ${payment.items.map((it, i) => `
                  <tr>
                    <td style="text-align: center;">${i + 1}</td>
                    <td>${feeTypes.find(f => f.id === it.feeTypeId)?.name || 'Monthly Tuition Fee'}</td>
                    <td style="text-align: right; font-weight: bold;">${it.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
                ${payment.discountAmount > 0 ? `
                  <tr style="background: #ecfdf5; color: #065f46;">
                    <td style="text-align: center;">•</td>
                    <td>Fee Concession / Sibling Waiver (25% 2nd child / 50% 3rd+ child)</td>
                    <td style="text-align: right; font-weight: bold;">-${payment.discountAmount.toLocaleString()}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="boxes">
              <div class="box">
                <div class="box-title">Payable Within Due Date (By 10th)</div>
                <div class="box-amt">Rs. ${payableWithinDueDate.toLocaleString()}</div>
              </div>
              <div class="box box-red">
                <div class="box-title">Payable After Due Date (+Rs. ${defaultLateFine})</div>
                <div class="box-amt">Rs. ${payableAfterDueDate.toLocaleString()}</div>
              </div>
            </div>

            <div class="words"><strong>Amount in Words:</strong> ${amountInWords} Rupees Only.</div>
            <div style="font-size: 7.5px; color: #555; margin-top: 3px;">
              * Note: Sibling Fee concessions (2nd child: 25%, 3rd+ child: 50%) and admission concessions are factored in percentages.
            </div>
          </div>

          <div class="sig-row">
            <div>.........................<br>Depositor / Parent</div>
            <div><strong>${payment.collectedBy || 'Cashier Desk'}</strong><br>Bank Cashier / Stamp</div>
            <div><em>Authorized</em><br>Principal / Bursar Seal</div>
          </div>
        </div>

        <div class="cut-line">✂ CUT HERE - HALF A4 PERFORATION ✂</div>

        <!-- Bottom Half: Student Copy -->
        <div class="half-slip">
          <img src="${logoSrc}" class="watermark" alt="Watermark" />
          <div class="content">
            <div class="header-row">
              <div class="school-info">
                <img src="${logoSrc}" class="school-logo" alt="Logo" />
                <div>
                  <div class="school-name">${settings.schoolName}</div>
                  <div class="school-sub">Main Campus · Garhi Kapura, Mardan · Ph: ${settings.phone}</div>
                  <div class="school-sub">Email: ${settings.email || 'iqra.gk1994@gmail.com'} · FB: fb.com/iqra.gk1994 · Session: ${settings.activeSession}</div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="border: 1.5px solid #059669; color: #065f46; background: #ecfdf5; padding: 2px 6px; font-size: 8px; font-weight: bold; display: inline-block;">STUDENT / PARENT COPY</div>
                <div style="font-size: 9px; font-weight: bold; margin-top: 2px;">Challan #: ${payment.receiptNumber}</div>
                <div style="font-size: 8px; font-family: monospace; font-weight: bold; color: #047857;">Tracking #: ${payment.trackingNumber || `TRK-2026-${payment.receiptNumber.slice(-4)}`}</div>
                <div style="font-size: 8px; color: #666;">Date: ${payment.date}</div>
              </div>
            </div>

            <div class="banner">
              <span>MONTHLY FEE CHALLAN / VOUCHER (HALF A4)</span>
              <span>Month: ${payment.month} ${payment.year} | Due Date: 10/${payment.month.slice(0, 3)}/${payment.year}</span>
            </div>

            <table class="info-table">
              <tr>
                <td class="info-label">Student Name:</td>
                <td><strong>${studentFullName}</strong></td>
                <td class="info-label">Class & Sec:</td>
                <td><strong>${classNameStr} (Roll: ${student?.rollNumber || '101'})</strong></td>
              </tr>
              <tr>
                <td class="info-label">Father's Name:</td>
                <td>${fatherName}</td>
                <td class="info-label">Admission #:</td>
                <td>${student?.admissionNumber || 'IQ-2024-001'}</td>
              </tr>
            </table>

            <table class="fee-table">
              <thead>
                <tr>
                  <th style="width: 25px; text-align: center;">#</th>
                  <th style="text-align: left;">Particulars / Fee Head</th>
                  <th style="text-align: right; width: 100px;">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                ${payment.items.map((it, i) => `
                  <tr>
                    <td style="text-align: center;">${i + 1}</td>
                    <td>${feeTypes.find(f => f.id === it.feeTypeId)?.name || 'Monthly Tuition Fee'}</td>
                    <td style="text-align: right; font-weight: bold;">${it.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
                ${payment.discountAmount > 0 ? `
                  <tr style="background: #ecfdf5; color: #065f46;">
                    <td style="text-align: center;">•</td>
                    <td>Fee Concession / Sibling Waiver (25% 2nd child / 50% 3rd+ child)</td>
                    <td style="text-align: right; font-weight: bold;">-${payment.discountAmount.toLocaleString()}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="boxes">
              <div class="box">
                <div class="box-title">Payable Within Due Date (By 10th)</div>
                <div class="box-amt">Rs. ${payableWithinDueDate.toLocaleString()}</div>
              </div>
              <div class="box box-red">
                <div class="box-title">Payable After Due Date (+Rs. ${defaultLateFine})</div>
                <div class="box-amt">Rs. ${payableAfterDueDate.toLocaleString()}</div>
              </div>
            </div>

            <div class="words"><strong>Amount in Words:</strong> ${amountInWords} Rupees Only.</div>
            <div style="font-size: 7.5px; color: #555; margin-top: 3px;">
              * Note: Sibling Fee concessions (2nd child: 25%, 3rd+ child: 50%) and admission concessions are factored in percentages.
            </div>
          </div>

          <div class="sig-row">
            <div>.........................<br>Depositor / Parent</div>
            <div><strong>${payment.collectedBy || 'Cashier Desk'}</strong><br>Bank Cashier / Stamp</div>
            <div><em>Authorized</em><br>Principal / Bursar Seal</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Half-A4 Compact Slip Component (Height optimized to 135mm so 2 fit on a single A4)
  const HalfA4Slip = ({
    copyType,
    copyColor,
  }: {
    copyType: 'SCHOOL / ACCOUNTS COPY' | 'STUDENT / PARENT COPY' | 'BANK COPY';
    copyColor: string;
  }) => (
    <div className="relative overflow-hidden bg-white border-2 border-neutral-900 p-3 sm:p-3.5 text-neutral-900 rounded-none shadow-xs font-sans text-[10px] leading-tight flex flex-col justify-between w-full max-w-4xl mx-auto my-1 box-border">
      {/* Background Watermark with School Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.08]">
        <img
          src={settings.logoUrl || '/iqra_logo.jpg'}
          alt="Watermark"
          className="w-56 h-56 object-contain filter grayscale"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-1.5 mb-1.5">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="h-10 w-10 object-contain shrink-0"
                />
              ) : (
                <div className="h-9 w-9 bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                  IQRA
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-black tracking-tight uppercase text-neutral-900 leading-none">
                    {settings.schoolName || 'IQRA SCHOOL AND COLLEGE GARHI KAPURA MARDAN'}
                  </h2>
                  <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-sm bg-neutral-100 text-neutral-700 border border-neutral-300">
                    {student?.category || 'Co-Education'}
                  </span>
                </div>
                <p className="text-[8.5px] font-semibold text-neutral-700 leading-tight mt-0.5">
                  Main Campus · Garhi Kapura, Mardan · Ph: {settings.phone} · Email: {settings.email || 'iqra.gk1994@gmail.com'}
                </p>
                <p className="text-[7.5px] text-neutral-500 font-mono leading-none mt-0.5">
                  FB: <a href="https://web.facebook.com/profile.php?id=100057113664245" target="_blank" rel="noreferrer" className="underline text-blue-600">fb.com/iqra.gk1994</a> · Reg: {settings.registrationNumber || 'IQRA-GK-1994-01'} · Session: {settings.activeSession}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-block font-mono font-bold text-[8.5px] px-2 py-0.5 uppercase tracking-wider border ${copyColor}`}
              >
                {copyType}
              </span>
              <div className="mt-0.5 font-mono font-bold text-[9.5px] text-neutral-800">
                Challan #: {payment.receiptNumber}
              </div>
              <div className="text-[8.5px] font-mono font-bold text-blue-700">
                Tracking #: {payment.trackingNumber || `TRK-2026-${payment.receiptNumber.slice(-4)}`}
              </div>
              <div className="text-[8px] font-mono text-neutral-500">
                Issue Date: {payment.date}
              </div>
            </div>
          </div>

          {/* Challan Banner with Due Dates */}
          <div className="bg-neutral-900 text-white py-0.5 px-2 text-[9px] font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>MONTHLY FEE CHALLAN / VOUCHER (HALF A4)</span>
            <span className="font-mono text-[8.5px] font-normal">
              Month: <strong>{payment.month} {payment.year}</strong> · Due Date: <strong className="text-amber-300">10/{payment.month.slice(0, 3)}/{payment.year}</strong>
            </span>
          </div>

          {/* Student Data Grid */}
          <div className="border border-neutral-300 rounded-xs mb-1.5 overflow-hidden bg-white/90">
            <table className="w-full text-left text-[9px]">
              <tbody>
                <tr className="border-b border-neutral-200">
                  <td className="py-0.5 px-2 font-semibold text-neutral-600 bg-neutral-100 w-24">Student Name:</td>
                  <td className="py-0.5 px-2 font-bold text-neutral-900 uppercase">
                    {student ? `${student.firstName} ${student.lastName}` : 'N/A'}
                  </td>
                  <td className="py-0.5 px-2 font-semibold text-neutral-600 bg-neutral-100 w-20">Class & Sec:</td>
                  <td className="py-0.5 px-2 font-bold text-neutral-800">
                    {cls?.name || 'Class 10'} ({sec?.name || 'Section A'}) · Roll: {student?.rollNumber || '101'}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 px-2 font-semibold text-neutral-600 bg-neutral-100">Father's Name:</td>
                  <td className="py-0.5 px-2 font-medium text-neutral-900">
                    {parent?.fatherName || parent?.guardianName || 'Muhammad Arshad Khan'}
                  </td>
                  <td className="py-0.5 px-2 font-semibold text-neutral-600 bg-neutral-100">Adm No:</td>
                  <td className="py-0.5 px-2 font-mono font-semibold text-neutral-900">
                    {student?.admissionNumber || 'IQ-2024-001'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fee Particulars & Totals Grid (2 Columns: Table on Left, Totals & Stamp on Right) */}
          <div className="grid grid-cols-12 gap-2 mb-1 items-start bg-white/90">
            {/* Left: Fee Particulars Table */}
            <div className="col-span-7">
              <table className="w-full text-left text-[9px] border border-neutral-700">
                <thead>
                  <tr className="bg-neutral-800 text-white font-bold text-[8px] uppercase tracking-wider">
                    <th className="py-0.5 px-1.5 w-6 text-center">#</th>
                    <th className="py-0.5 px-1.5">Particulars / Fee Head</th>
                    <th className="py-0.5 px-1.5 text-right w-20">Amount ({settings.currencySymbol || 'Rs.'})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {payment.items.map((item, idx) => {
                    const ft = feeTypes.find((f) => f.id === item.feeTypeId);
                    return (
                      <tr key={idx}>
                        <td className="py-0.5 px-1.5 text-center font-mono text-neutral-400">{idx + 1}</td>
                        <td className="py-0.5 px-1.5 font-medium">{ft?.name || 'Monthly Tuition Fee'}</td>
                        <td className="py-0.5 px-1.5 text-right font-mono font-semibold tabular-nums">
                          {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {payment.discountAmount > 0 && (
                    <tr className="bg-emerald-50 text-emerald-800 font-semibold">
                      <td className="py-0.5 px-1.5 text-center font-mono">•</td>
                      <td className="py-0.5 px-1.5">
                        Concession / Sibling Waiver ({payment.discountReason || '25% Sibling Discount'})
                      </td>
                      <td className="py-0.5 px-1.5 text-right font-mono tabular-nums">
                        -{payment.discountAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  {payment.balanceAmount > 0 && (
                    <tr className="bg-amber-50 text-amber-900 font-semibold">
                      <td className="py-0.5 px-1.5 text-center font-mono">•</td>
                      <td className="py-0.5 px-1.5">Previous Arrears / Unpaid Dues</td>
                      <td className="py-0.5 px-1.5 text-right font-mono tabular-nums">
                        +{payment.balanceAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="text-[7px] text-neutral-500 italic mt-0.5">
                * Sibling concessions: 2nd child 25%, 3rd+ child 50%. Admission concessions calculated in %.
              </p>
            </div>

            {/* Right: Surcharges & Highlights */}
            <div className="col-span-5 space-y-1">
              <div className="border-2 border-emerald-700 bg-emerald-50 p-1 text-center rounded-xs">
                <span className="block text-[7.5px] font-bold text-emerald-900 uppercase">
                  Payable Within Due Date (By 10th)
                </span>
                <span className="font-mono font-black text-sm text-emerald-900 tabular-nums">
                  {settings.currencySymbol}{payableWithinDueDate.toLocaleString()}
                </span>
              </div>

              <div className="border border-rose-700 bg-rose-50 p-1 text-center rounded-xs">
                <span className="block text-[7.5px] font-bold text-rose-900 uppercase">
                  Payable After Due Date (+{settings.currencySymbol}{defaultLateFine} Late Fine)
                </span>
                <span className="font-mono font-black text-xs text-rose-900 tabular-nums">
                  {settings.currencySymbol}{payableAfterDueDate.toLocaleString()}
                </span>
              </div>

              {/* In words */}
              <div className="text-[8px] text-neutral-600 bg-neutral-100 p-1 rounded-xs">
                <span className="font-semibold">Words: </span>
                <span className="italic">{amountInWords} Only</span>
              </div>
            </div>
          </div>

          {/* Verification stamp if paid */}
          {showPaidStamp && payment.paidAmount > 0 && (
            <div className="border border-emerald-600 bg-emerald-50/70 px-2 py-0.5 mb-1 rounded-xs flex items-center justify-between text-[8px] text-emerald-900">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                <span>
                  <strong>RECEIVED & VERIFIED:</strong> {settings.currencySymbol}{payment.paidAmount.toLocaleString()} via {payment.paymentMethod}
                </span>
              </div>
              <span className="font-bold border border-emerald-600 px-1 uppercase tracking-widest text-[8px] bg-white">
                PAID STAMP
              </span>
            </div>
          )}
        </div>

        {/* Signature Strip */}
        <div className="pt-1 border-t border-dashed border-neutral-400 grid grid-cols-3 gap-2 text-center text-[7.5px]">
          <div>
            <div className="h-4 flex items-end justify-center text-neutral-400 font-mono">
              ......................
            </div>
            <span className="text-neutral-600 font-medium block">Depositor / Parent</span>
          </div>
          <div>
            <div className="h-4 flex items-end justify-center font-mono font-bold text-[8px] text-neutral-800">
              {payment.collectedBy || 'Cashier Desk'}
            </div>
            <span className="text-neutral-600 font-medium block">Bank Cashier / Stamp</span>
          </div>
          <div>
            <div className="h-4 flex items-end justify-center font-serif italic text-[8.5px] text-neutral-800">
              Authorized
            </div>
            <span className="text-neutral-600 font-medium block">Principal / Bursar Seal</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto modal-backdrop-print print:static print:p-0 print:m-0 print:bg-white print:overflow-visible">
      {/* Hidden print style ensuring clean single/half-page or POS thermal print */}
      <style>{`
        @media print {
          @page {
            size: ${receiptFormat === 'thermal' ? '80mm auto' : 'A4 portrait'};
            margin: ${receiptFormat === 'thermal' ? '0mm' : '4mm 5mm'};
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .print-hidden-element {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-5xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none print:overflow-visible">
        
        {/* Screen Controls Header (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 px-4 py-3 sm:px-6 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 print:hidden gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-emerald-600" />
              School Fee Challan & Voucher
            </span>

            {/* Layout Switcher */}
            <div className="flex items-center gap-1 bg-neutral-200/80 dark:bg-neutral-700/60 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setReceiptFormat('half-a4-split')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  receiptFormat === 'half-a4-split'
                    ? 'bg-white shadow-xs font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300'
                }`}
                title="Half A4 (2 Copies per A4 Sheet: School Copy & Student Copy with Perforation Cut)"
              >
                📄 Half-A4 (2-in-1 Sheet)
              </button>
              <button
                onClick={() => setReceiptFormat('half-a4-single')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  receiptFormat === 'half-a4-single'
                    ? 'bg-white shadow-xs font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300'
                }`}
                title="Single Half A4 Voucher (A5 Size)"
              >
                Half-A4 Single (A5)
              </button>
              <button
                onClick={() => setReceiptFormat('dual')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  receiptFormat === 'dual'
                    ? 'bg-white shadow-xs font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300'
                }`}
                title="Side by Side Columns"
              >
                Dual Side-by-Side
              </button>
              <button
                onClick={() => setReceiptFormat('thermal')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  receiptFormat === 'thermal'
                    ? 'bg-white shadow-xs font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300'
                }`}
              >
                POS Slip
              </button>
            </div>

            {/* Paid Stamp Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={showPaidStamp}
                onChange={(e) => setShowPaidStamp(e.target.checked)}
                className="rounded-sm border-neutral-300 text-emerald-600 focus:ring-emerald-500"
              />
              Show "PAID" Stamp
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={printPosSlip}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-bold text-white hover:bg-neutral-800 shadow-2xs cursor-pointer transition-all"
              title="Directly Print 80mm POS Thermal Slip"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              <span>Print POS Slip</span>
            </button>
            <button
              onClick={printHalfA4}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer transition-all"
              title="Directly Print standard Half-A4 fee challan voucher (2-in-1 School & Student Copies)"
            >
              <Printer className="h-4 w-4" />
              <span>Print Half-A4 Voucher</span>
            </button>
            <button
              onClick={handleOpenPrintWindow}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-50 px-2.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-2xs cursor-pointer transition-all"
              title="Open clean standalone printable invoice in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Canvas */}
        <div className="p-3 sm:p-5 overflow-y-auto max-h-[82vh] bg-neutral-100/60 dark:bg-neutral-950/40 print:bg-white print:p-0 print:max-h-none print:overflow-visible print:block print:w-full">
          
          {/* Format 1: Two Half-A4 Vouchers on One Standard A4 Sheet (Matches User Request: "the fees voucher should be in half of A4 paper") */}
          {receiptFormat === 'half-a4-split' && (
            <div className="flex flex-col justify-between max-w-4xl mx-auto print:w-full print:m-0 space-y-2">
              {/* Top Half of A4 Paper: School Copy */}
              <HalfA4Slip
                copyType="SCHOOL / ACCOUNTS COPY"
                copyColor="bg-neutral-100 text-neutral-900 border-neutral-900"
              />

              {/* Horizontal Perforated Cut Line */}
              <div className="flex items-center gap-2 text-neutral-400 my-1 select-none print:flex">
                <div className="border-t-2 border-dashed border-neutral-500 flex-1" />
                <div className="flex items-center gap-1.5 px-2 text-[9px] font-mono tracking-widest text-neutral-600 uppercase bg-white dark:bg-neutral-900 border border-neutral-300 rounded-sm">
                  <Scissors className="h-3.5 w-3.5 text-neutral-600" />
                  <span>TEAR / CUT ALONG DOTTED LINE (HALF A4)</span>
                  <Scissors className="h-3.5 w-3.5 text-neutral-600 -scale-x-100" />
                </div>
                <div className="border-t-2 border-dashed border-neutral-500 flex-1" />
              </div>

              {/* Bottom Half of A4 Paper: Student Copy */}
              <HalfA4Slip
                copyType="STUDENT / PARENT COPY"
                copyColor="bg-emerald-50 text-emerald-900 border-emerald-700"
              />
            </div>
          )}

          {/* Format 2: Single Half-A4 Voucher (A5 Paper) */}
          {receiptFormat === 'half-a4-single' && (
            <div className="max-w-3xl mx-auto">
              <HalfA4Slip
                copyType="STUDENT / PARENT COPY"
                copyColor="bg-emerald-50 text-emerald-900 border-emerald-700"
              />
            </div>
          )}

          {/* Format 3: Side-by-Side Dual Columns */}
          {receiptFormat === 'dual' && (
            <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-center max-w-5xl mx-auto print:gap-4 print:w-full">
              <HalfA4Slip
                copyType="SCHOOL / ACCOUNTS COPY"
                copyColor="bg-neutral-100 text-neutral-900 border-neutral-900"
              />
              <div className="hidden lg:flex flex-col items-center justify-between text-neutral-400 py-4 select-none px-1 print:flex">
                <Scissors className="h-4 w-4 text-neutral-500 rotate-90" />
                <div className="border-l-2 border-dashed border-neutral-400 h-full my-2" />
                <Scissors className="h-4 w-4 text-neutral-500 -rotate-90" />
              </div>
              <HalfA4Slip
                copyType="STUDENT / PARENT COPY"
                copyColor="bg-emerald-50 text-emerald-900 border-emerald-700"
              />
            </div>
          )}

          {/* Format 4: POS Thermal Slip (80mm) */}
          {receiptFormat === 'thermal' && (
            <div className="max-w-[340px] mx-auto rounded-lg border border-neutral-400 bg-white p-4 font-mono text-[11px] text-neutral-900 shadow-sm leading-tight">
              <div className="text-center border-b border-dashed border-neutral-400 pb-2">
                <h3 className="font-extrabold text-xs uppercase tracking-tight">
                  {settings.schoolName || 'IQRA EDUCATION SYSTEM'}
                </h3>
                <p className="text-[10px]">{settings.address}, {settings.city}</p>
                <p className="text-[10px]">Ph: {settings.phone}</p>
                <div className="mt-1 font-bold bg-neutral-900 text-white py-0.5 px-2 inline-block text-[10px]">
                  FEE PAYMENT RECEIPT
                </div>
                <div className="mt-1 font-bold">Challan #: {payment.receiptNumber}</div>
                <div>Date: {payment.date}</div>
              </div>

              <div className="py-2 border-b border-dashed border-neutral-400 space-y-1 text-[10px]">
                <div>Student: <strong>{student ? `${student.firstName} ${student.lastName}` : 'N/A'}</strong></div>
                <div>Category: {student?.category || 'Co-Education'}</div>
                <div>Father: {parent?.fatherName || 'Muhammad Arshad Khan'}</div>
                <div>Adm No: {student?.admissionNumber || 'IQ-2024-001'}</div>
                <div>Class: {cls?.name} ({sec?.name}) · Roll: {student?.rollNumber || '101'}</div>
                <div>Month: {payment.month} {payment.year}</div>
                <div>Payment Method: {payment.paymentMethod}</div>
              </div>

              <div className="py-2 border-b border-dashed border-neutral-400 space-y-1">
                {payment.items.map((it, idx) => {
                  const ft = feeTypes.find((f) => f.id === it.feeTypeId);
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{ft?.name || 'Academic Fee'}</span>
                      <span>Rs. {it.amount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="py-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Gross Total:</span>
                  <span>Rs. {payment.subtotal.toLocaleString()}</span>
                </div>
                {payment.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount / Sibling:</span>
                    <span>-Rs. {payment.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs border-t border-neutral-800 pt-1">
                  <span>Net Payable:</span>
                  <span>Rs. {payment.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Amount Paid:</span>
                  <span>Rs. {payment.paidAmount.toLocaleString()}</span>
                </div>
                {payment.balanceAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Remaining Balance:</span>
                    <span>Rs. {payment.balanceAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="text-center border-t border-dashed border-neutral-400 pt-2 text-[9px] text-neutral-600">
                <p>Thank you for your prompt payment.</p>
                <p>Collected by: {payment.collectedBy}</p>
                <p className="text-[8px] text-neutral-400 mt-1">Half-A4 computerized fee slip.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
