<?php

include "connection.php";

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['price']) && isset($data['type']) && isset($data['date']) && isset($data['userId'])) {
    
    $price = $data['price'];
    $type = $data['type'];
    $date = $data['date'];
    $userId = $data['userId'];

    $query = $connection->prepare("INSERT INTO transactions (price, type, Date, user_id) VALUES (?, ?, ?, ?)");

    $query->bind_param("issi", $price, $type, $date, $userId);
    
    if ($query->execute()) {
        
        $response = [
            'success' => true,
            'message' => 'Transaction added successfully',
            'data' => [
                'price' => $price,
                'type' => $type,
                'date' => $date,
                'userId' => $userId
            ]
        ];
        
        echo json_encode($response);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to add transaction'
        ]);
    }

    $query->close();
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid input'
    ]);
}

