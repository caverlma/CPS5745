<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}

$sql = "SELECT Batter_Team, count(Batter_Team) AS Homerun_Count from Homeruns GROUP BY Batter_Team";

$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Batter_Team' => $row['Batter_Team'],
            'Homerun_Count' => (int)$row['Homerun_Count']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$con->close();