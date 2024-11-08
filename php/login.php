<?php

include "connection.php";
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['userId']) && isset($data['password'])) {
    $id = $data['userId'];
    $password = $data['password'];

    $query = $connection->prepare("SELECT id, password,name, budget FROM users WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $hashedPassword = $user['password'];

        if (password_verify($password, $hashedPassword)) {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user_id' => $user['id'],
                    'username' => $user['name'],
                    'budget' => $user['budget']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid password'
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
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

