<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}

$sql = "SELECT DISTINCT Batter_Team from Homeruns ORDER BY Batter_Team";
$result = mysqli_query($con,$sql);

$teams = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $teams[] = $row['Batter_Team'];
    }
}
echo json_encode($teams);

$conn->close();