<?php
class NodoDoble {
    public $dato;
    public $siguiente;
    public $anterior;
    public function __construct($dato) { $this->dato = $dato; }
}

class ListaDoble {
    public $cabeza = null;

    public function insertar($dato) {
        $nuevo = new NodoDoble($dato);
        if ($this->cabeza == null) {
            $this->cabeza = $nuevo;
        } else {
            $temp = $this->cabeza;
            while ($temp->siguiente != null) $temp = $temp->siguiente;
            $temp->siguiente = $nuevo;
            $nuevo->anterior = $temp;
        }
    }

    public function obtenerTodos() {
        $datos = [];
        $temp = $this->cabeza;
        while ($temp != null) {
            $datos[] = $temp->dato;
            $temp = $temp->siguiente;
        }
        return $datos;
    }
}
?>