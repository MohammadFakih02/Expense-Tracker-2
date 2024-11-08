<?php

include "connection.php";

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['name']) && isset($data['budget'])) {
    $username = $data['name'];
    $budget = $data['budget'];
    $query = $connection->prepare("INSERT INTO users(name,budget) Values(?, ?)");
    $query->bind_param("ss", $username, $budget);

    if($query->execute()){
    $response = [
        'success' => true,
        'message' => 'User created successfully',
        'data' => [
            'username' => $username,
            'budget' => $budget
        ]
    ];
    echo json_encode($response);
}else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create user'
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