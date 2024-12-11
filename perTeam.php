<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}

$min_year = isset($_POST['min']) ? (int)$_POST['min'] : 2006;
$max_year = isset($_POST['max']) ? (int)$_POST['max'] : 2017;
if (isset($_POST['uid'])) {
    $uid = $_POST['uid'];

    $sql = "SELECT * from 2024F_caverlma.User_Setting WHERE uid = '$uid'";
    $result = mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
    $count = mysqli_num_rows($result);

    if ($count == 1) {
        $min_year = $row['slider_low_value'];
        $max_year = $row['slider_high_value'];
}

}



$sql = "SELECT Batter_Team, count(Batter_Team) AS Homerun_Count from Homeruns WHERE YEAR(Game_Date) >= '" . $min_year . "' AND YEAR(Game_Date) <= '" . $max_year . "' GROUP BY Batter_Team;";

$result = mysqli_query($con,$sql);


if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Batter_Team' => $row['Batter_Team'],
            'Homerun_Count' => (int)$row['Homerun_Count']
        );
    }

    $response['data'] = $data;
    $response['min_year'] = $min_year;
    $response['max_year'] = $max_year;
    
    echo json_encode($response);
} else {
    echo json_encode(['data' => [], 'min_year' => $min_year, 'max_year' => $max_year]);
}

$con->close();