<?php
class Nodo {
    public $dato;
    public $siguiente;

    public function __construct($dato) {
        $this->dato = $dato;
        $this->siguiente = null;
    }
}

class ListaSimple {
    public $cabeza = null;

    public function insertar($dato) {
        $nuevo = new Nodo($dato);

        if ($this->cabeza == null) {
            $this->cabeza = $nuevo;
        } else {
            $temp = $this->cabeza;
            while ($temp->siguiente != null) {
                $temp = $temp->siguiente;
            }
            $temp->siguiente = $nuevo;
        }
    }
}
?>