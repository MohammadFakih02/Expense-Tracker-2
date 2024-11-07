<?php

include "connection.php";

$id = $_GET['user_id'];

if($id != null){
  $query = $connection->prepare("SELECT * FROM users WHERE id = $id");

  $query->execute();

  $result = $query->get_result();

  if($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    echo json_encode($user);
  } else {
    echo json_encode([
      "message" => "Not Found"
    ]);
  }
}