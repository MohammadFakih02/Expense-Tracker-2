<?php
include "connection.php";

$userId = $_GET['userId'];

$type = isset($_GET['type']) ? $_GET['type'] : '';
$date = isset($_GET['date']) ? $_GET['date'] : '';
$minPrice = isset($_GET['minPrice']) ? $_GET['minPrice'] : '';
$maxPrice = isset($_GET['maxPrice']) ? $_GET['maxPrice'] : '';

$queryStr = "SELECT price, type, date FROM transactions WHERE user_id = ?";

if ($type) {
    $queryStr .= " AND type = ?";
}
if ($date) {
    $queryStr .= " AND date = ?";
}
if ($minPrice) {
    $queryStr .= " AND price >= ?";
}
if ($maxPrice) {
    $queryStr .= " AND price <= ?";
}

$query = $connection->prepare($queryStr);

$params = [$userId];
$types = "i";

if ($type) {
    $params[] = $type;
    $types .= "s";
}
if ($date) {
    $params[] = $date;
    $types .= "s";
}
if ($minPrice) {
    $params[] = $minPrice;
    $types .= "i";
}
if ($maxPrice) {
    $params[] = $maxPrice;
    $types .= "i";
}

$query->bind_param($types, ...$params);

$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
    echo json_encode($transactions);
} else {
    echo json_encode(["message" => "No transactions found"]);
}
