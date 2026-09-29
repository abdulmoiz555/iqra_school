<?php
declare(strict_types=1);
require_once __DIR__ . '/config/config.php';

$user_name = $_SESSION['user_name'] ?? 'Sir Imran';
$user_role = $_SESSION['user_role'] ?? 'Super Admin';
$user_email = $_SESSION['user_email'] ?? 'iqra.gk1994@gmail.com';
$is_super = ($user_role === 'Super Admin');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERP Dashboard - Iqra School and College Garhi Kapura Mardan</title>
  <link rel="icon" type="image/jpeg" href="public/iqra_logo.jpg">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-100 text-neutral-900 min-h-screen flex flex-col">

  <!-- Top Navbar -->
  <header class="bg-white border-b border-neutral-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="public/iqra_logo.jpg" alt="Logo" class="h-10 w-10 rounded-lg object-contain border border-neutral-200 p-0.5 bg-white" onerror="this.src='src/assets/images/iqra_logo.jpg'">
        <div>
          <h1 class="text-sm sm:text-base font-black tracking-tight text-neutral-900 uppercase">
            Iqra School and College Garhi Kapura Mardan
          </h1>
          <p class="text-[10px] text-neutral-500">
            Session: 2025–2026 · Email: iqra.gk1994@gmail.com
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a href="index.php" class="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
          🌐 Public Website
        </a>

        <div class="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-xl text-xs">
          <div class="h-6 w-6 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center text-[10px]">
            👑
          </div>
          <div>
            <div class="font-bold text-neutral-800 leading-tight"><?= htmlspecialchars($user_name) ?></div>
            <div class="text-[10px] text-blue-600 font-semibold"><?= htmlspecialchars($user_role) ?></div>
          </div>
        </div>

        <a href="signin.php" class="text-xs text-neutral-500 hover:text-rose-600 font-semibold">
          Sign Out
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">

    <!-- Super Admin Banner -->
    <div class="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span class="bg-amber-400 text-neutral-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
          SUPER ADMIN CONTROLS (SIR IMRAN)
        </span>
        <h2 class="text-xl sm:text-2xl font-black mt-1">
          Welcome, Sir Imran
        </h2>
        <p class="text-xs text-blue-200 mt-1 max-w-xl">
          You hold root administrative authority over user roles, teacher attendance permissions, and fee invoice generation for Iqra School and College Garhi Kapura Mardan.
        </p>
      </div>

      <div class="bg-white/10 p-3 rounded-xl border border-white/20 text-xs font-mono shrink-0">
        <div>Official Email: <strong>iqra.gk1994@gmail.com</strong></div>
        <div>Facebook: <strong>fb.com/iqra.gk1994</strong></div>
        <div>Active Session: <strong>2025–2026</strong></div>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <span class="text-xs text-neutral-500 font-medium">Total Students</span>
        <div class="text-2xl font-black text-neutral-900">842</div>
        <div class="text-[11px] text-emerald-600 font-semibold">Admissions Open 2026-27</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <span class="text-xs text-neutral-500 font-medium">Faculty Members</span>
        <div class="text-2xl font-black text-neutral-900">42</div>
        <div class="text-[11px] text-blue-600 font-semibold">Class Teachers Authorized</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <span class="text-xs text-neutral-500 font-medium">Sibling Concessions</span>
        <div class="text-2xl font-black text-emerald-600">25% & 50%</div>
        <div class="text-[11px] text-neutral-500 font-medium">Active Policy in Force</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <span class="text-xs text-neutral-500 font-medium">Print Watermarked Invoices</span>
        <div class="text-2xl font-black text-blue-600">Half-A4</div>
        <div class="text-[11px] text-neutral-500 font-medium">With Iqra Emblem</div>
      </div>
    </div>

    <!-- Attendance Access Rule Notice -->
    <div class="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 space-y-2">
      <h3 class="font-bold text-amber-950 text-sm flex items-center gap-2">
        <span>🛡️ Attendance Access Authorization Matrix</span>
      </h3>
      <p class="text-xs text-amber-900 leading-relaxed">
        Attendance access roles and permissions are configured <strong>strictly by Super Admin (Sir Imran) and Admin</strong>, and are granted <strong>only to designated Class Teachers</strong>. Regular subject teachers cannot mark or alter daily attendance roll calls.
      </p>
    </div>

    <!-- Printable Invoice Demo Section -->
    <div class="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div>
          <h3 class="font-bold text-base text-neutral-900">
            Official Fee Challan & Invoice (With Watermark)
          </h3>
          <p class="text-xs text-neutral-500">
            Formatted to print 2 copies on a single Half-A4 sheet with school emblem watermark
          </p>
        </div>
        <button onclick="window.print()" class="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-sm">
          🖨️ Print Fee Invoice
        </button>
      </div>

      <!-- Watermarked Half-A4 Sample -->
      <div class="relative overflow-hidden border-2 border-neutral-900 bg-white p-4 max-w-2xl mx-auto rounded-none text-xs">
        <!-- Watermark -->
        <div class="absolute inset-0 flex items-center justify-center opacity-[0.09] pointer-events-none select-none">
          <img src="public/iqra_logo.jpg" alt="Watermark" class="w-64 h-64 object-contain filter grayscale" onerror="this.src='src/assets/images/iqra_logo.jpg'">
        </div>

        <div class="relative z-10 space-y-3">
          <div class="flex justify-between items-center border-b-2 border-neutral-900 pb-2">
            <div class="flex items-center gap-2">
              <img src="public/iqra_logo.jpg" class="h-10 w-10 object-contain" onerror="this.src='src/assets/images/iqra_logo.jpg'">
              <div>
                <h4 class="font-black text-sm uppercase">Iqra School and College Garhi Kapura Mardan</h4>
                <div class="text-[9px] text-neutral-600">Main Campus · Garhi Kapura · Ph: +92 345 9840192 · Email: iqra.gk1994@gmail.com</div>
                <div class="text-[8px] text-neutral-500 font-mono">FB: fb.com/iqra.gk1994 · Session: 2025–2026</div>
              </div>
            </div>
            <div class="text-right">
              <div class="border border-neutral-900 px-2 py-0.5 text-[9px] font-bold">SCHOOL / ACCOUNTS COPY</div>
              <div class="text-[10px] font-mono font-bold mt-1">Challan #: CHL-2026-0042</div>
            </div>
          </div>

          <table class="w-full text-left text-[10px] border border-neutral-300">
            <tr class="bg-neutral-100">
              <td class="p-1 font-semibold">Student Name:</td>
              <td class="p-1 font-bold">Hamza Arshad Khan</td>
              <td class="p-1 font-semibold">Class & Sec:</td>
              <td class="p-1 font-bold">Grade 9 (Section A)</td>
            </tr>
            <tr>
              <td class="p-1 font-semibold">Father's Name:</td>
              <td class="p-1">Muhammad Arshad Khan</td>
              <td class="p-1 font-semibold">Admission #:</td>
              <td class="p-1 font-mono">IQ-2024-001</td>
            </tr>
          </table>

          <table class="w-full text-left text-[10px] border border-neutral-800">
            <tr class="bg-neutral-800 text-white font-bold text-[9px]">
              <th class="p-1">Particulars</th>
              <th class="p-1 text-right">Amount (Rs.)</th>
            </tr>
            <tr>
              <td class="p-1">Monthly Tuition Fee (September 2026)</td>
              <td class="p-1 text-right font-mono font-bold">7,500</td>
            </tr>
            <tr class="bg-emerald-50 text-emerald-800 font-semibold">
              <td class="p-1">Sibling Concession (25% Discount on 2nd Child)</td>
              <td class="p-1 text-right font-mono">-1,875</td>
            </tr>
            <tr class="font-bold border-t border-neutral-800">
              <td class="p-1">Payable Within Due Date (By 10th):</td>
              <td class="p-1 text-right font-mono text-emerald-700 text-sm">Rs. 5,625</td>
            </tr>
          </table>

          <div class="text-[8px] text-neutral-500 italic">
            * Note: Sibling discounts (2nd child: 25%, 3rd+ child: 50%) and admission concessions are calculated in percentage.
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="bg-neutral-900 text-white text-xs p-4 text-center">
    © <?= date('Y') ?> Iqra School and College Garhi Kapura Mardan · Super Administrator: Sir Imran
  </footer>
</body>
</html>
