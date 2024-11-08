<?php
include "connection.php";

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['id'])) {

    $id = (int)$data['id'];

    $query = $connection->prepare("DELETE FROM transactions WHERE id = ?");
    $query->bind_param("i", $id);

    if ($query->execute()) {
        echo json_encode(['message' => 'Transaction deleted successfully']);
    } else {
        echo json_encode(['error' => 'Failed to delete transaction', 'details' => $query->error]);
    }
} else {
    echo json_encode(['error' => 'ID is required']);
}

