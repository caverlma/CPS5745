<?php
session_start();

// Check if the user is logged in
if (isset($_SESSION['user']) || isset($_COOKIE['user'])) {
    $_SESSION = array();
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'You have successfully logged out.']);
} else {echo json_encode(['status' => 'error', 'message' => 'You are not currently logged in.']);}