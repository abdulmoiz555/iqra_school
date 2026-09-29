<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON payload received.'
    ]);
    exit;
}

$subtotal = floatval($input['subtotal'] ?? 0);
$discount = floatval($input['discount'] ?? 0);
$fine     = floatval($input['fine'] ?? 0);
$paid     = floatval($input['paid'] ?? 0);

$totalNet   = max(0.0, ($subtotal - $discount) + $fine);
$balanceDue = max(0.0, $totalNet - $paid);

echo json_encode([
    'success' => true,
    'data' => [
        'subtotal'    => $subtotal,
        'discount'    => $discount,
        'fine'        => $fine,
        'totalAmount' => $totalNet,
        'paidAmount'  => $paid,
        'balance'     => $balanceDue
    ]
]);
