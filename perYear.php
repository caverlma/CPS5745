<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}


$sql = "SELECT MONTH(Game_Date) AS the_month, count(Game_Date) AS Homerun_Count FROM Homeruns WHERE Batter_Team = '" . $_POST['team'] . "' AND YEAR(Game_Date) = '" . $_POST['year'] . "' GROUP BY MONTH(Game_Date)";
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Month' => (int)$row['the_month'],
            'Homerun_Count' => (int)$row['Homerun_Count']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$con->close();