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
        $res = $conn->query("SELECT 
                c.id_curso, c.nombre_curso, c.area, c.grado,
                CONCAT(d.nombre, ' ', COALESCE(d.apellido, '')) AS docente_nombre
             FROM curso c
             LEFT JOIN docente d ON c.id_docente = d.id_docente
             ORDER BY c.id_curso DESC");
        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $nombre_curso = $_POST['nombre_curso'] ?? '';
        $area = $_POST['area'] ?? '';
        $grado = $_POST['grado'] ?? '';
        $id_docente = (int)($_POST['id_docente'] ?? 0);

        if (empty($nombre_curso) || empty($area) || empty($grado)) {
            errorJSON("Nombre del curso, área y grado son obligatorios");
        }

        $stmt = $conn->prepare("INSERT INTO curso (nombre_curso, area, grado, id_docente) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nombre_curso, $area, $grado, $id_docente]);

        echo json_encode(["mensaje" => "Curso agregado correctamente"]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id_curso'] ?? 0;

        $stmt = $conn->prepare("UPDATE curso SET nombre_curso=?, area=?, grado=?, id_docente=? WHERE id_curso=?");
        $stmt->execute([$input['nombre_curso'], $input['area'], $input['grado'], $input['id_docente'], $id]);

        echo json_encode(["mensaje" => "Curso actualizado"]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM curso WHERE id_curso = ?");
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Curso eliminado"]);
        break;
}
?>