<?php

namespace App\Http\Controllers\config;

use App\Http\Controllers\Controller;
use App\Models\config\Modulo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function modulos(){
        return Inertia::render('home', [
            'modulos' => Modulo::where('mod_estado', 1)->get(),
        ]);
    }
}
