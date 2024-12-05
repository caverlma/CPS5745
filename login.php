<?php
                session_start();
                include "dbconfig.php";
                
                if (isset($_SESSION['user'])) {
                    echo json_encode(['status' => 'already_logged_in', 'message' => 'You are already logged in as ' . $_SESSION['user']['name'] . '.', 'name' => $_SESSION['user']['name'], 'uid' => $_SESSION['user']['uid'], 'login' => $_SESSION['user']['login'], 'gender' => $_SESSION['user']['gender']]);
                    exit();
                }

                $con = mysqli_connect($server,$login,$password,$dbname);
                if (!$con) {die("Connection failed: " . mysqli_connect_error());}

                if(isset($_POST["username"])){
                    $clogin = mysqli_real_escape_string($con, $_POST['username']); //login
                    $cpassword = mysqli_real_escape_string($con, $_POST['password']); //password

                    $sql = "SELECT * FROM DV_User WHERE login = '$clogin' and password = '$cpassword'";
                    $result = mysqli_query($con, $sql);
                    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                    $count = mysqli_num_rows($result);
                }
                
                if ($count == 1){
                    $_SESSION['user'] = $row;
                    echo json_encode(['status' => 'logging_in', 'message' => 'Welcome ' . $_SESSION['user']['name'] . '!', 'name' => $_SESSION['user']['name'], 'uid' => $_SESSION['user']['uid'], 'login' => $_SESSION['user']['login'], 'gender' => $_SESSION['user']['gender']]);
                }
                else{
                    echo json_encode(['status' => 'login_failure', 'message' => 'Error with username or password!']);
                    die;
                }
?>