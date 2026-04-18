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

switch ($metodo) {
    case 'GET':
        $res = $conn->query("SELECT c.*, m.id_estudiante, m.id_curso,
                                    e.nombre as estudiante_nombre, e.apellido as estudiante_apellido,
                                    cur.nombre_curso 
                             FROM calificacion c
                             JOIN matricula m ON c.id_matricula = m.id_matricula
                             JOIN estudiante e ON m.id_estudiante = e.id_estudiante
                             JOIN curso cur ON m.id_curso = cur.id_curso
                             ORDER BY c.id_calificacion DESC");

        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $nota = (float)($_POST['nota'] ?? 0);
        $periodo = $_POST['periodo'] ?? '';
        $observacion = $_POST['observacion'] ?? '';
        $id_matricula = (int)($_POST['id_matricula'] ?? 0);

        if ($nota < 0 || $nota > 100 || $id_matricula == 0) {
            errorJSON("Nota inválida o matrícula no seleccionada");
        }

        $stmt = $conn->prepare("INSERT INTO calificacion (nota, periodo, observacion, id_matricula) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nota, $periodo, $observacion, $id_matricula]);

        echo json_encode(["mensaje" => "Calificación guardada correctamente"]);
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) errorJSON("ID inválido");

        $stmt = $conn->prepare("DELETE FROM calificacion WHERE id_calificacion = ?");
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Calificación eliminada"]);
        break;
}
?>