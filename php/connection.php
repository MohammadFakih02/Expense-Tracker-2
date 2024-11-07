<?php

$host = "localhost";
$dbuser = "root";
$pass = "";
$dbname = "expense_db";

$connection = new mysqli($host, $dbuser, $pass, $dbname);

if ($connection->connect_error){
  die("Error happened");
}