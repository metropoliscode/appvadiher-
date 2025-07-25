<?php

namespace App\Helpers;

class Toast
{
    /**
     * Create a new class instance.
     */
    public static function success($mensaje)
    {
        session()->flash('success', $mensaje);
    }
}
