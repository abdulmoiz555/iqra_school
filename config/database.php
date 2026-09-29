<?php
declare(strict_types=1);

/**
 * Database Connection Configuration using PDO
 * MySQL 8+ / MariaDB 10.4+ / UTF-8 mb4
 */

$host     = getenv('DB_HOST') ?: 'localhost';
$dbname   = getenv('DB_NAME') ?: 'school_management';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';
$charset  = 'utf8mb4';

$dsn = "mysql:host={$host};dbname={$dbname};charset={$charset}";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    // In production, log error internally and display friendly message
    error_log('Database Connection Error: ' . $e->getMessage());
    die('Database connection could not be established. Please verify MySQL service status.');
}
