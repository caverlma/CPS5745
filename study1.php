<?php 
$q = intval($_GET['q']);

include "dbconfig.php";
$con = mysqli_connect($server,$login,$password,$dbname);
if (!$con) {die("Connection failed: " . mysqli_connect_error());}

if ($q == 1){$sql = "SELECT Batter_Team, count(Batter_Team) AS Homerun_Count from Homeruns GROUP BY Batter_Team";}
else {$sql = "SELECT Batter_Team, count(Batter_Team) AS Homerun_Count from Homeruns WHERE Batter_Team = 'ARI' GROUP BY Batter_Teams";}
$result = mysqli_query($con,$sql);

if(mysqli_num_rows($result) > 0){

    $homerunarray = "";
    while($row = mysqli_fetch_array($result)) {
        $homerunarray .= $row[0].", ".$row[1]."/";
    }
    $homerunarray = rtrim($homerunarray, "/");

    print $homerunarray;

}else{echo mysqli_error($con);}

mysqli_close($con);

?>