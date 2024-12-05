<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}

$sql = "SELECT * FROM Homeruns";
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Record_ID' => (int)$row['Record_ID'],
            'Game_Date' => $row['Game_Date'],
            'Batter' => $row['Batter'],
            'Batter_Team' => $row['Batter_Team'],
            'Pitcher' => $row['Pitcher'],
            'Pitcher_Team' => $row['Pitcher_Team'],
            'Inning' => (int)$row['Inning'],
            'Distance' => (int)$row['Distance'],
            'Exit_Velocity' => (float)$row['Exit_Velocity'],
            'Elevation_Angle' => (float)$row['Elevation_Angle'],
            'Horizontal_Angle' => (float)$row['Horizontal_Angle'],
            'Apex' => (int)$row['Apex'],
            'Ballpark' => $row['Ballpark']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$con->close();