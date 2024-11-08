<?php

include "connection.php";
header('Content-Type: application/json');

// Decode JSON input from POST body
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['user_id'] ?? null;
$budget = $data['budget'] ?? null;

// Validate input
if ($id !== null && $budget !== null) {
    // Prepare the SQL update query
    $query = $connection->prepare("UPDATE users SET budget = ? WHERE id = ?");
    
    // Ensure correct data types: adjust "di" based on your database schema
    // "d" for double (float), "i" for integer
    // If budget is an integer, use "ii"
    // If budget is a decimal, use "di"
    // Adjust accordingly. Here assuming budget is a double and id is integer:
    $query->bind_param("di", $budget, $id);
    
    if ($query->execute()) {
        if ($query->affected_rows > 0) {
            // Successfully updated
            echo json_encode([
                "success" => true,
                "message" => "Budget updated successfully",
                "data" => [
                    "user_id" => $id,
                    "budget" => $budget
                ]
            ]);
        } else {
            // No rows affected - possibly invalid user_id
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "User ID not found or budget unchanged"
            ]);
        }
    } else {
        // Execution failed
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update budget"
        ]);
    }

    $query->close(); // Close the statement
} else {
    // Invalid input
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid input: Missing user ID or budget"
    ]);
}

$connection->close(); // Close the database connection
