<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\comercial\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $periodos = Venta::select('period')->distinct()->get();
        $sedes    = Venta::select('codalm', 'nomalm')->distinct()->get();

        // Ventas por sede por mes
        $ventasPorSedeMes = Venta::selectRaw("
            DATE_FORMAT(fecope, '%Y%m') as mes,
            nomalm,
            codalm,
            tipdoc,
            dias,
            venta as total,
            utilid,
            costo,
            period,
            DATE(fecope) as fecope")->get();


        return Inertia::render('dashboard', [
            'periodos' => $periodos,
            'sedes'    => $sedes,
            'ventasPorSedeMes' => $ventasPorSedeMes,
            'periodoSeleccionado' => 'todos',
            'sedeSeleccionada' => 'todas',
        ]);
    }

}
