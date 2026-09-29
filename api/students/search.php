<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

$query = trim($_GET['q'] ?? '');

if (strlen($query) < 2) {
    echo json_encode(['success' => true, 'students' => []]);
    exit;
}

try {
    $searchTerm = "%{$query}%";
    $stmt = $pdo->prepare("
        SELECT s.id, s.admission_number, s.roll_number, s.first_name, s.last_name, s.gender, s.phone,
               c.name as class_name, sec.name as section_name, p.father_name
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN sections sec ON s.section_id = sec.id
        LEFT JOIN parents p ON s.parent_id = p.id
        WHERE s.first_name LIKE :q1 
           OR s.last_name LIKE :q2 
           OR s.admission_number LIKE :q3 
           OR s.roll_number LIKE :q4
        LIMIT 20
    ");

    $stmt->execute([
        ':q1' => $searchTerm,
        ':q2' => $searchTerm,
        ':q3' => $searchTerm,
        ':q4' => $searchTerm
    ]);

    $students = $stmt->fetchAll();

    echo json_encode([
        'success'  => true,
        'count'    => count($students),
        'students' => $students
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Query execution error: ' . $e->getMessage()
    ]);
}
