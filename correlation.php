<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}


$sql = "SELECT Exit_Velocity, Distance FROM Homeruns";
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Exit_Velocity' => (int)$row['Exit_Velocity'],
            'Distance' => (int)$row['Distance']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$con->close();