<?php
include("../config/conexion.php");

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function errorJSON($mensaje, $code = 400) {
    http_response_code($code);
    echo json_encode(["error" => $mensaje]);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'GET':
        $res = $conn->query("SELECT 
            m.id_matricula,
            m.fecha_matricula,
            m.estado,
            CONCAT(e.nombre, ' ', e.apellido) AS estudiante,
            c.nombre_curso AS curso
        FROM matricula m
        JOIN estudiante e ON m.id_estudiante = e.id_estudiante
        JOIN curso c ON m.id_curso = c.id_curso
        ORDER BY m.id_matricula DESC");

        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $fecha = $_POST['fecha_matricula'] ?? date('Y-m-d');
        $estado = $_POST['estado'] ?? 'Activa';
        $id_estudiante = (int)($_POST['id_estudiante'] ?? 0);
        $id_curso = (int)($_POST['id_curso'] ?? 0);

        if ($id_estudiante <= 0 || $id_curso <= 0) {
            errorJSON("Debe seleccionar estudiante y curso");
        }

        $stmt = $conn->prepare("INSERT INTO matricula (fecha_matricula, estado, id_estudiante, id_curso) VALUES (?, ?, ?, ?)");
        $stmt->execute([$fecha, $estado, $id_estudiante, $id_curso]);

        echo json_encode([
            "mensaje" => "Matrícula registrada correctamente",
            "id" => $conn->lastInsertId()
        ]);
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) errorJSON("ID inválido");

        $stmt = $conn->prepare("DELETE FROM matricula WHERE id_matricula = ?");
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Matrícula eliminada correctamente"]);
        break;

    default:
        errorJSON("Método no permitido", 405);
}
?>