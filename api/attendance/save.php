<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['records']) || !is_array($input['records'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Attendance records array is required.'
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO student_attendance (student_id, class_id, section_id, date, status, remarks)
        VALUES (:student_id, :class_id, :section_id, :date, :status, :remarks)
        ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)
    ");

    foreach ($input['records'] as $record) {
        $stmt->execute([
            ':student_id' => $record['student_id'],
            ':class_id'   => $record['class_id'],
            ':section_id' => $record['section_id'],
            ':date'       => $record['date'],
            ':status'     => $record['status'],
            ':remarks'    => $record['remarks'] ?? null
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Attendance successfully recorded for ' . count($input['records']) . ' students.'
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Unable to save attendance records: ' . $e->getMessage()
    ]);
}
