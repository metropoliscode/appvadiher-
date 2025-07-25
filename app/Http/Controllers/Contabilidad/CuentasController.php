<?php

namespace App\Http\Controllers\Contabilidad;

use App\Http\Controllers\Controller;
use App\Models\comercial\Venta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CuentasController extends Controller
{
    public function index(Request $request)
    {
        // Filtros disponibles
        $periodos = Venta::select('period')->distinct()->get();
        $sedes    = Venta::select('codalm', 'nomalm')->distinct()->get();

        // Consulta con filtros aplicados
        $query = Venta::query();

        if ($request->filled('periodo') && $request->input('periodo') !== 'todos') {
            $query->where('period', $request->input('periodo'));
        }

        if ($request->filled('sede') && $request->input('sede') !== 'todas') {
            $query->where('codalm', $request->input('sede'));
        }

        $ventas = $query->select('venta', 'valiva', 'costo', 'tipmov')->get();

        // Mapeo de códigos de documentos
        $nombresDocs = [
            '01' => 'Factura de Venta',
            '03' => 'Nota Debito a Factura',
            '04' => 'Nota Credito a Factura',
            '06' => 'Nota Credito Independiente Factura',
            '08' => 'Nota de Débito',
            '13' => 'Factura de Caja',
            '15' => 'Devolucion Ind de Caja',
        ];

        // Inicializar resumen contable por cuenta
        $cuentas = [
            'total'  => ['D' => 0, 'C' => 0, 'docs' => []],
            'valiva' => ['D' => 0, 'C' => 0, 'docs' => []],
            'venta'  => ['D' => 0, 'C' => 0, 'docs' => []],
            'costo'  => ['D' => 0, 'C' => 0, 'docs' => []],
            'compra' => ['D' => 0, 'C' => 0, 'docs' => []],
        ];

        foreach ($ventas as $v) {
            $esFactura = in_array($v->tipmov, ['01', '13', '03']); // Factura o nota débito
            $nombreDoc = $nombresDocs[$v->tipmov] ?? $v->tipmov;

            // === TOTAL ===
            $montoTotal = $v->venta + $v->valiva;
            $cuentas['total'][$esFactura ? 'D' : 'C'] += $montoTotal;
            $cuentas['total']['docs'][$nombreDoc] = ($cuentas['total']['docs'][$nombreDoc] ?? 0) + ($esFactura ? $montoTotal : -$montoTotal);

            // === IVA ===
            $cuentas['valiva'][$esFactura ? 'C' : 'D'] += $v->valiva;
            $cuentas['valiva']['docs'][$nombreDoc] = ($cuentas['valiva']['docs'][$nombreDoc] ?? 0) + ($esFactura ? $v->valiva : -$v->valiva);

            // === VENTA ===
            $cuentas['venta'][$esFactura ? 'C' : 'D'] += $v->venta;
            $cuentas['venta']['docs'][$nombreDoc] = ($cuentas['venta']['docs'][$nombreDoc] ?? 0) + ($esFactura ? $v->venta : -$v->venta);

            // === COSTO ===
            $cuentas['costo'][$esFactura ? 'D' : 'C'] += $v->costo;
            $cuentas['costo']['docs'][$nombreDoc] = ($cuentas['costo']['docs'][$nombreDoc] ?? 0) + ($esFactura ? $v->costo : -$v->costo);

            // === COMPRA ===
            $cuentas['compra'][$esFactura ? 'C' : 'D'] += $v->costo;
            $cuentas['compra']['docs'][$nombreDoc] = ($cuentas['compra']['docs'][$nombreDoc] ?? 0) + ($esFactura ? $v->costo : -$v->costo);
        }

        // Construir resumen final
        $resumen = collect($cuentas)->map(function ($valores, $cuenta) {
            $debito  = round($valores['D'] ?? 0, 2);
            $credito = round($valores['C'] ?? 0, 2);

            $documentos = collect($valores['docs'] ?? [])->map(function ($valor, $tipdoc) {
                return [
                    'tipdoc' => $tipdoc,
                    'total'  => round($valor, 2),
                ];
            })->values();

            return [
                'cuenta'     => $cuenta,
                'debito'     => $debito,
                'credito'    => $credito,
                'tipo'       => $debito > $credito ? 'D' : 'C',
                'total'      => round(abs($debito - $credito), 2),
                'documentos' => $documentos,
            ];
        })->values();

        return Inertia::render('contabilidad/cuentas', [
            'periodos' => $periodos,
            'sedes'    => $sedes,
            'resumen'  => $resumen,
            'filters'  => $request->only('periodo', 'sede'),
        ]);
    }
}
