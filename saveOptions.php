<?php
                session_start();
                include "dbconfig.php";

                $con = mysqli_connect($server,$login,$password,$dbname);
                if (!$con) {die("Connection failed: " . mysqli_connect_error());}

                $min_year = $_POST['min'];
                $max_year = $_POST['max'];
                $uid = $_POST['uid'];
                $login = $_POST['login'];
                $now = date('Y-m-d H:i:s');

                $sql = "SELECT * from 2024F_caverlma.User_Setting WHERE uid = '$uid' and login = '$login'";
                $result = mysqli_query($con, $sql);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $count = mysqli_num_rows($result);
                
                
                if ($count == 0){
                    $sql = "INSERT INTO 2024F_caverlma.User_Setting VALUES ('$uid', '$login', '$min_year', '$max_year', '$now')";
                    $result = mysqli_query($con, $sql);
                    echo json_encode(['message' => 'Settings saved!']);
                }
                else if ($count == 1){
                    $sql = "UPDATE 2024F_caverlma.User_Setting SET slider_low_value='$min_year', slider_high_value='$max_year' WHERE `uid`='$uid'";
                    $result = mysqli_query($con, $sql);
                    echo json_encode(['message' => 'Settings updated!']);
                }
                else{
                    echo json_encode(['message' => 'Error with saving settings!']);
                    die;
                }
?>