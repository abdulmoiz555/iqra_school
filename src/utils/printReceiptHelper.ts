import { FeePayment, Student, SchoolClass, Section, Parent, SchoolSettings, FeeType } from '../types';

// Convert numbers to words (e.g. 4500 -> "Four Thousand Five Hundred")
export function numberToWords(num: number): string {
  if (!num || num === 0) return 'Zero';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(Math.round(num));
}

/**
 * Universal In-Page Iframe Printer
 * Bypasses iframe popup blockers (window.open block in iframe preview),
 * avoids printing the main app dashboard/navbar,
 * and prints ONLY the targeted clean voucher or thermal receipt.
 */
export function printReceiptViaIframe(htmlContent: string) {
  let iframe = document.getElementById('sms-receipt-print-iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'sms-receipt-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Iframe print error, falling back to window.print()', err);
      window.print();
    }
  }, 300);
}

export interface PrintReceiptData {
  payment: FeePayment;
  student?: Student | null;
  cls?: SchoolClass | null;
  sec?: Section | null;
  parent?: Parent | null;
  settings: SchoolSettings;
  feeTypes: FeeType[];
}

/**
 * Generates Half-A4 Two-in-One Fee Voucher HTML (School Copy + Student Copy on 1 A4 Page)
 */
export function generateHalfA4VoucherHtml(data: PrintReceiptData): string {
  const { payment, student, cls, sec, parent, settings, feeTypes } = data;
  const studentFullName = student ? `${student.firstName} ${student.lastName}` : 'N/A';
  const fatherName = parent?.fatherName || parent?.guardianName || 'Muhammad Arshad Khan';
  const classNameStr = `${cls?.name || 'Class 9'} (${sec?.name || 'A'})`;
  const logoSrc = window.location.origin + (settings.logoUrl || '/iqra_logo.jpg');
  const defaultLateFine = payment.fineAmount > 0 ? payment.fineAmount : 300;
  const payableWithinDueDate = payment.totalAmount;
  const payableAfterDueDate = payment.totalAmount + defaultLateFine;
  const amountInWords = numberToWords(payment.paidAmount > 0 ? payment.paidAmount : payableWithinDueDate);

  const renderSingleSlip = (copyType: string, isStudentCopy: boolean) => `
    <div class="half-slip">
      <img src="${logoSrc}" class="watermark" alt="Watermark" />
      <div class="content">
        <div class="header-row">
          <div class="school-info">
            <img src="${logoSrc}" class="school-logo" alt="Logo" onerror="this.style.display='none'" />
            <div>
              <div class="school-name">${settings.schoolName}</div>
              <div class="school-sub">Main Campus · Garhi Kapura, Mardan · Ph: ${settings.phone}</div>
              <div class="school-sub">Email: ${settings.email || 'iqra.gk1994@gmail.com'} · Session: ${settings.activeSession}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="${isStudentCopy ? 'copy-badge-student' : 'copy-badge-school'}">${copyType}</div>
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
          * Note: Computerized official challan voucher. Dues payable via Cash Desk or Habib Bank Limited Garhi Kapura.
        </div>
      </div>

      <div class="sig-row">
        <div>.........................<br>Depositor / Parent</div>
        <div><strong>${payment.collectedBy || 'Cashier Desk'}</strong><br>Bank Cashier / Stamp</div>
        <div><em>Authorized</em><br>Principal / Bursar Seal</div>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fee Voucher - ${studentFullName} - ${payment.receiptNumber}</title>
      <meta charset="utf-8">
      <style>
        @page { size: A4 portrait; margin: 4mm 6mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        body { background: #fff; color: #111; padding: 4px; }
        .half-slip {
          position: relative;
          border: 2px solid #111;
          padding: 8px 12px;
          margin-bottom: 6px;
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
          opacity: 0.07;
          pointer-events: none;
          z-index: 0;
        }
        .content { position: relative; z-index: 2; }
        .header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 4px; margin-bottom: 4px; }
        .school-info { display: flex; align-items: center; gap: 8px; }
        .school-logo { width: 44px; height: 44px; object-fit: contain; }
        .school-name { font-size: 13px; font-weight: 900; text-transform: uppercase; }
        .school-sub { font-size: 8px; color: #444; }
        .copy-badge-school { background: #f3f4f6; color: #111; border: 1.5px solid #111; padding: 2px 6px; font-size: 8px; font-weight: bold; display: inline-block; }
        .copy-badge-student { background: #ecfdf5; color: #065f46; border: 1.5px solid #059669; padding: 2px 6px; font-size: 8px; font-weight: bold; display: inline-block; }
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
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${renderSingleSlip('SCHOOL / ACCOUNTS COPY', false)}
      <div class="cut-line">✂ CUT HERE - HALF A4 PERFORATION ✂</div>
      ${renderSingleSlip('STUDENT / PARENT COPY', true)}
    </body>
    </html>
  `;
}

/**
 * Generates 80mm POS Thermal Receipt Slip HTML
 */
export function generateThermalPosSlipHtml(data: PrintReceiptData): string {
  const { payment, student, cls, sec, parent, settings, feeTypes } = data;
  const studentFullName = student ? `${student.firstName} ${student.lastName}` : 'N/A';
  const fatherName = parent?.fatherName || parent?.guardianName || 'Muhammad Arshad Khan';
  const classNameStr = `${cls?.name || 'Class'} (${sec?.name || 'A'})`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>POS Slip - ${payment.receiptNumber}</title>
      <meta charset="utf-8">
      <style>
        @page { size: 80mm auto; margin: 2mm 3mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace, monospace; }
        body { width: 74mm; margin: 0 auto; color: #000; background: #fff; font-size: 11px; line-height: 1.25; }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 4px 0; }
        .double-divider { border-top: 2px solid #000; margin: 4px 0; }
        .row { display: flex; justify-content: space-between; margin: 1.5px 0; }
        .bold { font-weight: bold; }
        .header-title { font-size: 13px; font-weight: 900; text-transform: uppercase; }
        .badge { background: #000; color: #fff; padding: 1px 4px; display: inline-block; font-size: 10px; margin-top: 2px; }
        .stamp { border: 2px solid #000; font-weight: 900; font-size: 12px; padding: 2px 6px; text-align: center; margin: 5px auto; width: 60%; }
        @media print {
          body { width: 100%; margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="center">
        <div class="header-title">${settings.schoolName}</div>
        <div style="font-size: 9.5px;">Main Campus · Garhi Kapura, Mardan</div>
        <div style="font-size: 9.5px;">Ph: ${settings.phone}</div>
        <div class="badge">FEE PAYMENT POS SLIP</div>
        <div class="bold" style="margin-top: 3px;">Challan #: ${payment.receiptNumber}</div>
        <div style="font-size: 9.5px;">Date: ${payment.date} · Session: ${settings.activeSession}</div>
      </div>

      <div class="divider"></div>

      <div>
        <div class="row"><span>Student:</span><span class="bold">${studentFullName}</span></div>
        <div class="row"><span>Father:</span><span>${fatherName}</span></div>
        <div class="row"><span>Adm No:</span><span class="bold">${student?.admissionNumber || 'N/A'}</span></div>
        <div class="row"><span>Class/Sec:</span><span>${classNameStr}</span></div>
        <div class="row"><span>Roll No:</span><span class="bold">${student?.rollNumber || 'N/A'}</span></div>
        <div class="row"><span>Month:</span><span class="bold">${payment.month} ${payment.year}</span></div>
        <div class="row"><span>Method:</span><span>${payment.paymentMethod}</span></div>
      </div>

      <div class="divider"></div>

      <div class="bold" style="margin-bottom: 2px;">FEE PARTICULARS:</div>
      ${payment.items.map((it) => {
        const ftName = feeTypes.find(f => f.id === it.feeTypeId)?.name || 'Tuition Fee';
        return `
          <div class="row">
            <span>${ftName}</span>
            <span class="bold">Rs. ${it.amount.toLocaleString()}</span>
          </div>
        `;
      }).join('')}

      ${payment.discountAmount > 0 ? `
        <div class="row" style="font-style: italic;">
          <span>Sibling/Waiver Disc:</span>
          <span>-Rs. ${payment.discountAmount.toLocaleString()}</span>
        </div>
      ` : ''}

      <div class="divider"></div>

      <div class="row"><span>Gross Total:</span><span>Rs. ${payment.subtotal.toLocaleString()}</span></div>
      ${payment.discountAmount > 0 ? `<div class="row"><span>Concession:</span><span>-Rs. ${payment.discountAmount.toLocaleString()}</span></div>` : ''}
      <div class="row bold" style="font-size: 12px;"><span>Net Payable:</span><span>Rs. ${payment.totalAmount.toLocaleString()}</span></div>
      <div class="row bold" style="font-size: 12px;"><span>Amount Paid:</span><span>Rs. ${payment.paidAmount.toLocaleString()}</span></div>
      ${payment.balanceAmount > 0 ? `
        <div class="row bold" style="font-size: 11px;"><span>Remaining Balance:</span><span>Rs. ${payment.balanceAmount.toLocaleString()}</span></div>
      ` : `
        <div class="stamp">PAID IN FULL</div>
      `}

      <div class="divider"></div>

      <div class="center" style="font-size: 9px; margin-top: 6px;">
        <div>Cashier: ${payment.collectedBy || 'Accounts Desk'}</div>
        <div style="margin-top: 2px;">Thank you for your timely payment!</div>
        <div style="font-size: 8px; color: #444; margin-top: 4px;">*** Computer Generated POS Slip ***</div>
      </div>
    </body>
    </html>
  `;
}
