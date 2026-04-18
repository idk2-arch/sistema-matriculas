<?php
class NodoCircular {
    public $dato;
    public $siguiente;
    public function __construct($dato) { $this->dato = $dato; }
}

class ListaCircular {
    public $cabeza = null;

    public function insertar($dato) {
        $nuevo = new NodoCircular($dato);
        if ($this->cabeza == null) {
            $this->cabeza = $nuevo;
            $nuevo->siguiente = $nuevo;
        } else {
            $temp = $this->cabeza;
            while ($temp->siguiente != $this->cabeza) $temp = $temp->siguiente;
            $temp->siguiente = $nuevo;
            $nuevo->siguiente = $this->cabeza;
        }
    }

    public function obtenerTodos() {
        $datos = [];
        if (!$this->cabeza) return $datos;
        $temp = $this->cabeza;
        do {
            $datos[] = $temp->dato;
            $temp = $temp->siguiente;
        } while ($temp != $this->cabeza);
        return $datos;
    }
}
?>