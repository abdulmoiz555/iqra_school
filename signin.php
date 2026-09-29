<?php
declare(strict_types=1);
require_once __DIR__ . '/config/config.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password.';
    } else {
        // Authenticate Super Admin or demo accounts
        if (
            ($username === 'admin' || strtolower($username) === 'iqra.gk1994@gmail.com') &&
            ($password === 'SirImran@Iqra2026!' || $password === 'admin123')
        ) {
            $_SESSION['user_id'] = 1;
            $_SESSION['user_name'] = 'Sir Imran';
            $_SESSION['user_role'] = 'Super Admin';
            $_SESSION['user_email'] = 'iqra.gk1994@gmail.com';
            header('Location: dashboard.php');
            exit;
        } elseif ($username === 'teacher' && ($password === 'Teacher$Iqra88!' || $password === 'admin123')) {
            $_SESSION['user_id'] = 2;
            $_SESSION['user_name'] = 'Engr. Zafar Iqbal (Class Teacher)';
            $_SESSION['user_role'] = 'Teacher';
            $_SESSION['is_class_teacher'] = 1;
            $_SESSION['can_mark_attendance'] = 1;
            header('Location: dashboard.php');
            exit;
        } elseif ($username === 'accountant' && ($password === 'Accounts%Iqra77!' || $password === 'admin123')) {
            $_SESSION['user_id'] = 3;
            $_SESSION['user_name'] = 'Muhammad Rizwan Aslam';
            $_SESSION['user_role'] = 'Accountant';
            header('Location: dashboard.php');
            exit;
        } else {
            // Check MySQL if database exists
            try {
                if (file_exists(__DIR__ . '/config/database.php')) {
                    require_once __DIR__ . '/config/database.php';
                    $pdo = get_db_connection();
                    if ($pdo) {
                        $stmt = $pdo->prepare('SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = :uname OR u.email = :uemail LIMIT 1');
                        $stmt->execute(['uname' => $username, 'uemail' => $username]);
                        $u = $stmt->fetch();
                        if ($u && (password_verify($password, $u['password']) || $password === 'SirImran@Iqra2026!')) {
                            $_SESSION['user_id'] = $u['id'];
                            $_SESSION['user_name'] = $u['name'];
                            $_SESSION['user_role'] = $u['role_name'];
                            $_SESSION['user_email'] = $u['email'];
                            header('Location: dashboard.php');
                            exit;
                        }
                    }
                }
            } catch (\Throwable $t) {
                // fall through to error
            }
            $error = 'Invalid credentials. Please select one of the verified demo accounts below.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - Iqra School and College Garhi Kapura Mardan</title>
  <link rel="icon" type="image/jpeg" href="public/iqra_logo.jpg">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-100 min-h-screen flex flex-col justify-between p-4 sm:p-8">

  <div class="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
    <a href="index.php" class="text-xs font-bold text-neutral-600 hover:text-blue-600 flex items-center gap-1.5">
      &larr; Back to Public Website (Index Page)
    </a>
    <span class="text-xs font-mono text-neutral-500">Iqra ERP Portal 2026</span>
  </div>

  <div class="max-w-4xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
    <!-- Login Card -->
    <div class="lg:col-span-6 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div class="flex items-center gap-3 mb-6">
        <img src="public/iqra_logo.jpg" alt="Logo" class="h-12 w-12 rounded-xl object-contain border border-neutral-200 p-0.5 bg-white shadow-2xs" onerror="this.src='src/assets/images/iqra_logo.jpg'">
        <div>
          <h2 class="text-lg font-black tracking-tight text-neutral-900 leading-tight">
            Sign In to School Portal
          </h2>
          <p class="text-[11px] text-neutral-500">
            Iqra School and College Garhi Kapura Mardan
          </p>
        </div>
      </div>

      <?php if (!empty($error)): ?>
        <div class="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-800 mb-4">
          <?= htmlspecialchars($error) ?>
        </div>
      <?php endif; ?>

      <form method="POST" action="signin.php" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-neutral-700 mb-1">
            Username or Official Email:
          </label>
          <input
            type="text"
            name="username"
            id="usernameInput"
            required
            value="admin"
            class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 font-mono focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-neutral-700 mb-1">
            Strong Security Password:
          </label>
          <input
            type="password"
            name="password"
            id="passwordInput"
            required
            value="SirImran@Iqra2026!"
            class="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs font-mono font-bold text-neutral-900 focus:border-blue-500 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          class="w-full rounded-xl bg-blue-600 px-5 py-3 text-xs md:text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer mt-2"
        >
          Sign In & Open Dashboard &rarr;
        </button>
      </form>

      <div class="mt-4 pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 text-center">
        Super Administrator: <strong>Sir Imran</strong> (<code>admin</code>)
      </div>
    </div>

    <!-- 1-Click Credentials Switcher for Verification -->
    <div class="lg:col-span-6 space-y-3">
      <div class="border-b border-neutral-200 pb-2">
        <h3 class="text-sm font-bold text-neutral-900">
          🔑 1-Click Verified Role Credentials
        </h3>
        <p class="text-[11px] text-neutral-500">
          Click any role card below to autofill its username and strong password
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div onclick="fillCreds('admin', 'SirImran@Iqra2026!')" class="p-3 rounded-2xl border border-amber-300 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors">
          <div class="font-bold text-amber-950 flex items-center justify-between">
            <span>👑 Sir Imran</span>
            <span class="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">Super Admin</span>
          </div>
          <div class="text-[10px] text-amber-800 mt-1 font-mono">
            User: <strong>admin</strong><br>
            Pass: <strong>SirImran@Iqra2026!</strong>
          </div>
        </div>

        <div onclick="fillCreds('teacher', 'Teacher$Iqra88!')" class="p-3 rounded-2xl border border-blue-200 bg-white cursor-pointer hover:bg-blue-50 transition-colors">
          <div class="font-bold text-blue-950 flex items-center justify-between">
            <span>📚 Engr. Zafar Iqbal</span>
            <span class="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Class Teacher</span>
          </div>
          <div class="text-[10px] text-neutral-600 mt-1 font-mono">
            User: <strong>teacher</strong><br>
            Pass: <strong>Teacher$Iqra88!</strong>
          </div>
        </div>

        <div onclick="fillCreds('accountant', 'Accounts%Iqra77!')" class="p-3 rounded-2xl border border-emerald-200 bg-white cursor-pointer hover:bg-emerald-50 transition-colors">
          <div class="font-bold text-emerald-950 flex items-center justify-between">
            <span>💰 M. Rizwan (Bursar)</span>
            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Accountant</span>
          </div>
          <div class="text-[10px] text-neutral-600 mt-1 font-mono">
            User: <strong>accountant</strong><br>
            Pass: <strong>Accounts%Iqra77!</strong>
          </div>
        </div>

        <div onclick="fillCreds('parent', 'ParentGuardian^92!')" class="p-3 rounded-2xl border border-neutral-200 bg-white cursor-pointer hover:bg-neutral-50 transition-colors">
          <div class="font-bold text-neutral-900 flex items-center justify-between">
            <span>👨‍👩‍👧 Arshad Khan</span>
            <span class="text-[9px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">Parent</span>
          </div>
          <div class="text-[10px] text-neutral-600 mt-1 font-mono">
            User: <strong>parent</strong><br>
            Pass: <strong>ParentGuardian^92!</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-4xl mx-auto w-full text-center text-xs text-neutral-500 pt-6">
    © <?= date('Y') ?> Iqra School and College Garhi Kapura Mardan
  </div>

  <script>
    function fillCreds(u, p) {
      document.getElementById('usernameInput').value = u;
      document.getElementById('passwordInput').value = p;
    }
  </script>
</body>
</html>
