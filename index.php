<?php
declare(strict_types=1);
require_once __DIR__ . '/config/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Iqra School and College Garhi Kapura Mardan</title>
  <meta name="description" content="Official website and portal of Iqra School and College Garhi Kapura Mardan. Features #IQRA_TALENT_AWARD_CEREMONY 🏆, Video Showcase, Sibling Percentage Concessions, and School ERP.">
  <link rel="icon" type="image/jpeg" href="public/iqra_logo.jpg">
  <!-- Tailwind CSS CDN for XAMPP / Hostinger standalone execution -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html { scroll-behavior: smooth; }
  </style>
</head>
<body class="bg-neutral-50 text-neutral-900 antialiased selection:bg-blue-600 selection:text-white">

  <!-- Top Announcement Bar -->
  <div class="bg-blue-900 text-blue-100 text-xs py-2 px-4 border-b border-blue-800">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
      <div class="flex items-center gap-2">
        <span class="bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-sm font-black text-[10px] uppercase">
          ADMISSIONS OPEN 2026–2027
        </span>
        <span>Iqra School & College Garhi Kapura Mardan · Sibling Discount 25%–50% · Merit Scholarships</span>
      </div>
      <div class="flex items-center gap-4 text-[11px]">
        <a href="mailto:iqra.gk1994@gmail.com" class="hover:text-white flex items-center gap-1">
          <span>📧 iqra.gk1994@gmail.com</span>
        </a>
        <a href="https://web.facebook.com/profile.php?id=100057113664245" target="_blank" rel="noreferrer" class="hover:text-white text-blue-300 font-semibold underline">
          <span>Facebook Page</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Header & Navigation -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="public/iqra_logo.jpg" alt="Logo" class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-contain border border-neutral-200 p-0.5 bg-white shadow-xs" onerror="this.src='src/assets/images/iqra_logo.jpg'">
        <div>
          <h1 class="text-base sm:text-lg md:text-xl font-black tracking-tight text-neutral-900 uppercase">
            Iqra School and College Garhi Kapura Mardan
          </h1>
          <p class="text-[11px] text-neutral-500 hidden sm:block">
            Registered with BISE Mardan · Est. 1994 · Super Administrator: Sir Imran
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4 md:gap-6">
        <nav class="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-600">
          <a href="#about" class="hover:text-blue-600 transition-colors">About</a>
          <a href="#awards" class="hover:text-blue-600 font-bold text-blue-600">#IQRA_TALENT_AWARD_CEREMONY 🏆</a>
          <a href="#videos" class="hover:text-blue-600 transition-colors">Videos</a>
          <a href="#sibling-fees" class="hover:text-blue-600 transition-colors">Sibling Concession %</a>
          <a href="#contact" class="hover:text-blue-600 transition-colors">Contact</a>
        </nav>

        <a href="signin.php" class="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-all">
          <span>Portal Sign In</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 md:py-24 bg-gradient-to-b from-blue-50/80 via-white to-neutral-50 border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-800">
            <span>✨ Excellence in Pedagogy & Character Building</span>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            Iqra School and College <br>
            <span class="text-blue-600">Garhi Kapura Mardan</span>
          </h1>

          <p class="text-sm md:text-base text-neutral-600 max-w-2xl leading-relaxed">
            Leading academic institution in Garhi Kapura, Mardan. Providing high-standard education from Play Group to Higher Secondary College with modern science laboratories, computerized attendance, and transparent sibling discount percentages.
          </p>

          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a href="#awards" class="rounded-xl bg-amber-500 px-5 py-3 text-xs md:text-sm font-bold text-neutral-950 hover:bg-amber-400 shadow-md transition-all">
              #IQRA_TALENT_AWARD_CEREMONY 🏆
            </a>
            <a href="signin.php" class="rounded-xl bg-neutral-900 px-5 py-3 text-xs md:text-sm font-bold text-white hover:bg-neutral-800 shadow-md transition-all">
              Sign In to ERP Portal
            </a>
            <a href="#sibling-fees" class="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-xs md:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all">
              Sibling Fees & Admissions %
            </a>
          </div>

          <div class="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-200 max-w-md mx-auto lg:mx-0">
            <div>
              <div class="text-2xl font-black text-blue-600">30+</div>
              <div class="text-[11px] text-neutral-500">Years of Service</div>
            </div>
            <div>
              <div class="text-2xl font-black text-emerald-600">100%</div>
              <div class="text-[11px] text-neutral-500">Board Pass Rate</div>
            </div>
            <div>
              <div class="text-2xl font-black text-indigo-600">50%</div>
              <div class="text-[11px] text-neutral-500">Max Sibling Concession</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="rounded-3xl border-2 border-neutral-900/10 bg-white p-3 shadow-2xl">
            <img src="public/award_1.jpg" alt="#IQRA_TALENT_AWARD_CEREMONY 🏆" class="w-full rounded-2xl aspect-4/3 object-cover" onerror="this.src='src/assets/images/award_1.jpg'">
            <div class="mt-3 p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-neutral-900 block">Leadership of Sir Imran</span>
                <span class="text-[11px] text-neutral-500">Super Administrator & Principal</span>
              </div>
              <a href="signin.php" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700">
                ERP Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- #IQRA_TALENT_AWARD_CEREMONY 🏆 Section (In one cohesive set with description) -->
  <section id="awards" class="py-16 md:py-24 bg-white border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <span class="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
          ANNUAL ACHIEVEMENTS & POSITION HOLDERS
        </span>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-900">
          #IQRA_TALENT_AWARD_CEREMONY 🏆
        </h2>
        <p class="text-xs md:text-sm text-neutral-600">
          The complete official set of photographs and event summary for the Annual Talent Award Ceremony.
        </p>
      </div>

      <!-- Description Block -->
      <div class="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-6 md:p-8 space-y-4">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-lg shadow-sm">
            🏆
          </div>
          <div>
            <h3 class="text-base md:text-lg font-black text-amber-950">
              Ceremony Narrative & Merit Honors Report
            </h3>
            <p class="text-xs text-amber-800">
              Presided by Principal Sir Imran with Distinguished Educationists of Mardan
            </p>
          </div>
        </div>

        <p class="text-xs md:text-sm text-neutral-700 leading-relaxed text-justify">
          The <strong>#IQRA_TALENT_AWARD_CEREMONY 🏆</strong> at Iqra School and College Garhi Kapura Mardan honors the extraordinary dedication of students excelling in BISE Mardan board examinations, science project showcases, and moral conduct. Conferred awards include honorary shields, gold medals, scholarship awards, and certificates of distinction. Sir Imran delivered the presidential keynote emphasizing character development, perseverance, and institutional transparency.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div class="rounded-xl border border-amber-200 bg-white p-3">
            <span class="text-[10px] font-bold text-amber-600 uppercase">Board Toppers</span>
            <div class="font-black text-sm text-neutral-900">Gold Medals & Shields</div>
            <p class="text-[11px] text-neutral-500">Position holders in Matric & F.Sc.</p>
          </div>
          <div class="rounded-xl border border-amber-200 bg-white p-3">
            <span class="text-[10px] font-bold text-amber-600 uppercase">Scholarships</span>
            <div class="font-black text-sm text-neutral-900">100% Tuition Grants</div>
            <p class="text-[11px] text-neutral-500">Full waivers for top talent</p>
          </div>
          <div class="rounded-xl border border-amber-200 bg-white p-3">
            <span class="text-[10px] font-bold text-amber-600 uppercase">Teaching Staff</span>
            <div class="font-black text-sm text-neutral-900">Excellence Awards</div>
            <p class="text-[11px] text-neutral-500">Recognizing 100% subject results</p>
          </div>
        </div>
      </div>

      <!-- Unified Photo Showcase Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php
        $award_images = [
          ['file' => 'public/award_1.jpg', 'title' => 'Stage Award Felicitations', 'desc' => 'Conferring honorary shields and gold medals to board position holders.'],
          ['file' => 'public/award_2.jpg', 'title' => 'Shield Distribution by Sir Imran', 'desc' => 'Sir Imran presenting distinction trophies in presence of faculty.'],
          ['file' => 'public/award_3.jpg', 'title' => 'Academic Distinction Group', 'desc' => 'High-achieving students receiving merit scholarship vouchers.'],
          ['file' => 'public/award_4.jpg', 'title' => 'Moral & Co-Curricular Awards', 'desc' => 'Recognizing student character, sportsmanship, and leadership.'],
          ['file' => 'public/award_5.jpg', 'title' => 'Faculty & Mentorship Honors', 'desc' => 'Celebrating dedicated educators for exceptional student success.'],
        ];
        foreach ($award_images as $index => $item):
        ?>
        <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col">
          <div class="relative aspect-4/3 overflow-hidden bg-neutral-100">
            <img src="<?= htmlspecialchars($item['file']) ?>" alt="<?= htmlspecialchars($item['title']) ?>" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
            <span class="absolute top-3 left-3 bg-amber-500 text-neutral-950 font-black text-[10px] px-2 py-0.5 rounded-sm uppercase">
              Photo <?= $index + 1 ?> of 5
            </span>
          </div>
          <div class="p-4 space-y-1 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-sm text-neutral-900"><?= htmlspecialchars($item['title']) ?></h4>
              <p class="text-xs text-neutral-500 mt-1"><?= htmlspecialchars($item['desc']) ?></p>
            </div>
            <div class="pt-2 text-[11px] font-semibold text-blue-600">
              #IQRA_TALENT_AWARD_CEREMONY 🏆
            </div>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Dummy Section for Videos (Ready for user to customize) -->
  <section id="videos" class="py-16 md:py-24 bg-neutral-100/70 border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
            VIDEOS & MULTIMEDIA
          </span>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mt-2">
            Campus Video Showcase (Custom Dummy Section)
          </h2>
          <p class="text-xs md:text-sm text-neutral-500">
            Placeholder video frames ready for embedding your YouTube or MP4 video links.
          </p>
        </div>
        <div class="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl">
          ✏️ <strong>Notice:</strong> You can replace any iframe below with your own YouTube video URL in <code>index.php</code>.
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
          <div class="aspect-video bg-neutral-900 flex flex-col items-center justify-center text-white p-4 text-center">
            <span class="text-3xl mb-1">▶️</span>
            <div class="text-xs font-bold">#IQRA_TALENT_AWARD_CEREMONY 🏆</div>
            <div class="text-[10px] text-neutral-400">Duration: 14:20 · Highlights</div>
          </div>
          <div class="p-4">
            <h4 class="font-bold text-xs text-neutral-900">Talent Award Ceremony Full Video</h4>
            <p class="text-[11px] text-neutral-500 mt-1">Annual awards and speeches by Sir Imran.</p>
          </div>
        </div>

        <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
          <div class="aspect-video bg-neutral-900 flex flex-col items-center justify-center text-white p-4 text-center">
            <span class="text-3xl mb-1">▶️</span>
            <div class="text-xs font-bold">Principal Sir Imran's Address</div>
            <div class="text-[10px] text-neutral-400">Duration: 08:45 · Keynote</div>
          </div>
          <div class="p-4">
            <h4 class="font-bold text-xs text-neutral-900">Annual Academic Keynote</h4>
            <p class="text-[11px] text-neutral-500 mt-1">Guidance on character building and board exams.</p>
          </div>
        </div>

        <div class="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
          <div class="aspect-video bg-neutral-900 flex flex-col items-center justify-center text-white p-4 text-center">
            <span class="text-3xl mb-1">▶️</span>
            <div class="text-xs font-bold">Campus Tour & Science Labs</div>
            <div class="text-[10px] text-neutral-400">Duration: 06:15 · Facilities</div>
          </div>
          <div class="p-4">
            <h4 class="font-bold text-xs text-neutral-900">Garhi Kapura Campus Tour</h4>
            <p class="text-[11px] text-neutral-500 mt-1">Computer lab, library and physical science rooms.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sibling Fees & Admissions in Percentages -->
  <section id="sibling-fees" class="py-16 md:py-24 bg-white border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <span class="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
          FEE WAIVERS & PERCENTAGE CONCESSIONS
        </span>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-900">
          Sibling Fees & Admission Percentage Policy
        </h2>
        <p class="text-xs md:text-sm text-neutral-600">
          Clear percentage rules for family discounts and new admissions at Iqra School and College Garhi Kapura.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-center space-y-2">
          <span class="text-xs font-bold text-neutral-500 uppercase">First Child</span>
          <div class="text-3xl font-black text-neutral-900">0%</div>
          <span class="text-xs font-bold text-neutral-700 block">Standard Tuition Fee</span>
          <p class="text-[11px] text-neutral-500">100% of standard class fee schedule.</p>
        </div>

        <div class="rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-5 text-center space-y-2">
          <span class="text-xs font-bold text-emerald-700 uppercase">Second Child</span>
          <div class="text-3xl font-black text-emerald-700">25% OFF</div>
          <span class="text-xs font-bold text-emerald-900 block">Monthly Tuition Waiver</span>
          <p class="text-[11px] text-emerald-800">25% deducted automatically each month.</p>
        </div>

        <div class="rounded-2xl border-2 border-emerald-600 bg-emerald-100/70 p-5 text-center space-y-2">
          <span class="text-xs font-bold text-emerald-900 uppercase">Third Child+</span>
          <div class="text-3xl font-black text-emerald-800">50% OFF</div>
          <span class="text-xs font-bold text-emerald-950 block">Half-Tuition Concession</span>
          <p class="text-[11px] text-emerald-900">50% discount on 3rd, 4th, and subsequent children.</p>
        </div>

        <div class="rounded-2xl border-2 border-indigo-400 bg-indigo-50/70 p-5 text-center space-y-2">
          <span class="text-xs font-bold text-indigo-700 uppercase">Admission Fee</span>
          <div class="text-3xl font-black text-indigo-700">50%–100%</div>
          <span class="text-xs font-bold text-indigo-900 block">Admission Waiver</span>
          <p class="text-[11px] text-indigo-800">50% for siblings/Hafiz · 100% for Orphans & Teacher kids.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact & Footer -->
  <footer id="contact" class="py-16 bg-neutral-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <img src="public/iqra_logo.jpg" alt="Logo" class="h-10 w-10 rounded-lg object-contain bg-white p-0.5" onerror="this.src='src/assets/images/iqra_logo.jpg'">
            <h3 class="font-bold text-base leading-tight">
              Iqra School and College Garhi Kapura Mardan
            </h3>
          </div>
          <p class="text-xs text-neutral-400">
            Registered campus in Garhi Kapura, Mardan, Khyber Pakhtunkhwa. Quality education, moral discipline, and computerised administration.
          </p>
          <div class="text-xs text-amber-400 font-mono">
            Principal / Super Administrator: <strong>Sir Imran</strong>
          </div>
        </div>

        <div class="space-y-3 text-xs text-neutral-300">
          <h4 class="font-bold uppercase tracking-wider text-neutral-400">Official Contact & Social Info</h4>
          <p>📧 Email: <a href="mailto:iqra.gk1994@gmail.com" class="text-blue-400 underline">iqra.gk1994@gmail.com</a></p>
          <p>🌐 Facebook: <a href="https://web.facebook.com/profile.php?id=100057113664245" target="_blank" rel="noreferrer" class="text-blue-400 underline">fb.com/iqra.gk1994</a></p>
          <p>📞 Phone: +92 345 9840192 / +92 937 840192</p>
          <p>📍 Location: Main Bazaar Road, Garhi Kapura, Mardan (KP)</p>
        </div>

        <div class="space-y-3 text-xs">
          <h4 class="font-bold uppercase tracking-wider text-neutral-400">School ERP System</h4>
          <a href="signin.php" class="inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700">
            Sign In to School ERP &rarr;
          </a>
          <p class="text-neutral-500">
            Superadmin credentials: <code>admin</code> / <code>SirImran@Iqra2026!</code>
          </p>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row justify-between">
        <span>© <?= date('Y') ?> Iqra School and College Garhi Kapura Mardan.</span>
        <span>Registration: IQRA-GK-1994-01 · Active Session: 2025–2026</span>
      </div>
    </div>
  </footer>

</body>
</html>
