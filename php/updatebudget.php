<?php

include "connection.php";
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['user_id'] ?? null;
$budget = $data['budget'] ?? null;

if ($id !== null && $budget !== null) {
    $query = $connection->prepare("UPDATE users SET budget = ? WHERE id = ?");
    
    $query->bind_param("ii", $budget, $id);
    
    if ($query->execute()) {
        if ($query->affected_rows > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Budget updated ",
                "data" => [
                    "user_id" => $id,
                    "budget" => $budget
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "ID not found or budget unchanged"
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update budget"
        ]);
    }

    $query->close();
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid input: Missing user ID or budget"
    ]);
}

$connection->close();
