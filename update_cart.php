<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['productId'], $data['quantity']) && isset($_SESSION['cart'][$data['productId']])) {
        $productId = intval($data['productId']);
        $quantity = max(1, intval($data['quantity']));

        $_SESSION['cart'][$productId]['quantity'] = $quantity;
    }
}
?>
