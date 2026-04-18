<?php
include("../config/conexion.php");

header("Content-Type: application/json");
error_reporting(0);
ini_set('display_errors', 0);

function errorJSON($mensaje) {
    echo json_encode(["error" => $mensaje]);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];

if (isset($_GET['lista'])) {
    $res = $conn->query("SELECT nombre FROM estudiante");
    echo json_encode($res->fetchAll(PDO::FETCH_COLUMN));
    exit;
}

switch ($metodo) {
    case 'GET':
        $res = $conn->query("SELECT * FROM estudiante");
        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $nombre = $_POST['nombre'] ?? '';
        $apellido = $_POST['apellido'] ?? '';
        $fecha = $_POST['fecha_nacimiento'] ?? '2000-01-01';
        $telefono = $_POST['telefono'] ?? '';

        if (empty($nombre) || empty($apellido)) {
            errorJSON("Nombre y apellido son obligatorios");
        }

        $stmt = $conn->prepare("INSERT INTO estudiante (nombre, apellido, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nombre, $apellido, $fecha, $telefono]);

        echo json_encode(["mensaje" => "Estudiante guardado correctamente"]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) errorJSON("No llegaron datos");

        $id = $input['id'] ?? 0;

        $stmt = $conn->prepare("UPDATE estudiante SET nombre=?, apellido=?, fecha_nacimiento=?, telefono=? WHERE id_estudiante=?");
        $stmt->execute([$input['nombre'], $input['apellido'], $input['fecha_nacimiento'], $input['telefono'], $id]);

        echo json_encode(["mensaje" => "Estudiante actualizado"]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM estudiante WHERE id_estudiante = ?");
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Estudiante eliminado"]);
        break;
}
?>