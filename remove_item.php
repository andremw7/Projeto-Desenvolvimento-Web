<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['productId']) && isset($_SESSION['cart'][$data['productId']])) {
        $productId = intval($data['productId']);
        unset($_SESSION['cart'][$productId]);
    }
}
?>
