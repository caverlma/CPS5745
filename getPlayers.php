<?php
include 'dbconfig.php';

$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}

$sql = "SELECT Batter, COUNT(Batter) AS Homerun_Count FROM Homeruns WHERE Batter_Team = '" . $_POST['team'] . "' GROUP BY Batter";
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){
    $data = array();
    while($row = $result->fetch_assoc()) {
        $data[] = array(
            'Batter' => $row['Batter'],
            'Homerun_Count' => (int)$row['Homerun_Count']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$con->close();

?>