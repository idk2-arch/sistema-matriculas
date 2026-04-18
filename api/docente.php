<?php
include("../config/conexion.php");

header("Content-Type: application/json");
error_reporting(0);

function errorJSON($msg) {
    echo json_encode(["error" => $msg]);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];

if (isset($_GET['lista'])) {
    $res = $conn->query("SELECT CONCAT(nombre, ' ', apellido) as nombre FROM docente");
    echo json_encode($res->fetchAll(PDO::FETCH_COLUMN));
    exit;
}

switch ($metodo) {
    case 'GET':
        $res = $conn->query("SELECT * FROM docente");
        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $nombre = $_POST['nombre'] ?? '';
        $apellido = $_POST['apellido'] ?? '';
        $especialidad = $_POST['especialidad'] ?? '';
        $telefono = $_POST['telefono'] ?? '';

        if (empty($nombre) || empty($apellido)) errorJSON("Nombre y apellido obligatorios");

        $stmt = $conn->prepare("INSERT INTO docente(nombre, apellido, especialidad, telefono) VALUES(?, ?, ?, ?)");
        $stmt->execute([$nombre, $apellido, $especialidad, $telefono]);

        echo json_encode(["mensaje" => "Docente agregado correctamente"]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? 0;

        $stmt = $conn->prepare("UPDATE docente SET nombre=?, apellido=?, especialidad=?, telefono=? WHERE id_docente=?");
        $stmt->execute([$input['nombre'], $input['apellido'], $input['especialidad'], $input['telefono'], $id]);

        echo json_encode(["mensaje" => "Docente actualizado"]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM docente WHERE id_docente = ?");
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Docente eliminado"]);
        break;
}
?>