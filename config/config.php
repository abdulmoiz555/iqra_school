<?php
declare(strict_types=1);

/**
 * Global Application Configuration & Session Security
 */

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

define('APP_NAME', 'Iqra School and College Garhi Kapura Mardan');
define('APP_URL', 'http://localhost/iqra_school');
define('SCHOOL_EMAIL', 'iqra.gk1994@gmail.com');
define('SCHOOL_FACEBOOK', 'https://web.facebook.com/profile.php?id=100057113664245');
define('SCHOOL_ADDRESS', 'Garhi Kapura, Mardan, Khyber Pakhtunkhwa');
define('SUPERADMIN_NAME', 'Sir Imran');
define('DEFAULT_CURRENCY', 'PKR');
define('DEFAULT_CURRENCY_SYMBOL', 'Rs. ');

// CSRF Token Management
function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// XSS Sanitization Helper
function sanitize(string $data): string {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
