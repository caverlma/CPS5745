<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}


$sql = "SELECT DAY(Game_Date) as the_day, count(Game_Date) AS Homerun_Count FROM Homeruns WHERE Batter_Team = '" . $_POST['team'] . "' AND MONTH(Game_Date) = '" . $_POST['month'] . "' AND YEAR(Game_Date) = '" . $_POST['year'] . "' GROUP BY DAY(Game_Date)";
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Day' => (int)$row['the_day'],
            'Homerun_Count' => (int)$row['Homerun_Count']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$con->close();