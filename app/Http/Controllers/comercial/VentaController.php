<?php

namespace App\Http\Controllers\comercial;

use App\Http\Controllers\Controller;
use App\Models\comercial\Venta;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

class VentaController extends Controller
{
    public function ventas(Request $request){
        $periodo = $request->periodo;
        $periodos = Venta::select('period')->distinct()->get();
        $ventas = Venta::selectRaw('fecope,
                        SUM(CASE WHEN dias = 0 THEN venta ELSE 0 END) venta_contado,
                        SUM(CASE WHEN dias != 0 THEN venta ELSE 0 END) venta_credito,
                        SUM(CASE WHEN codalm != 0002 THEN venta ELSE 0 END) venta,
                        SUM(venta) venta_total,
                        SUM(CASE WHEN dias = 0 THEN utilid ELSE 0 END) utilidad_contado,
                        SUM(CASE WHEN dias != 0 THEN utilid ELSE 0 END) utilidad_credito,
                        SUM(CASE WHEN codalm != 0002 THEN utilid ELSE 0 END) utili,
                        SUM(utilid) utili_total')
                        ->when($periodo, function ($query, $periodo) {
                            return $query->where('period', $periodo);
                        })
                        ->groupBy('fecope')
                        ->get();

        return Inertia::render('comercial/vengenerales', [
            'periodos' => $periodos,
            'ventas'   => $ventas
        ]);
    }

    public function sede(Request $request){
        $periodo = $request->periodo;

        $periodos = Venta::select('period')->distinct()->get();

        $ventas = Venta::selectRaw('
            fecope,
            COALESCE(SUM(CASE WHEN codalm = "0001" THEN venta ELSE 0 END), 0) AS venta_metropolis,
            COALESCE(SUM(CASE WHEN codalm = "0002" THEN venta ELSE 0 END), 0) AS venta_distrimetro,
            COALESCE(SUM(CASE WHEN codalm = "0003" THEN venta ELSE 0 END), 0) AS venta_ferrecasas,
            COALESCE(SUM(CASE WHEN codalm = "0004" THEN venta ELSE 0 END), 0) AS venta_troncal,
            COALESCE(SUM(CASE WHEN codalm = "0005" THEN venta ELSE 0 END), 0) AS venta_minca,

            COALESCE(SUM(CASE WHEN codalm = "0001" THEN utilid ELSE 0 END), 0) AS utilid_metropolis,
            COALESCE(SUM(CASE WHEN codalm = "0002" THEN utilid ELSE 0 END), 0) AS utilid_distrimetro,
            COALESCE(SUM(CASE WHEN codalm = "0003" THEN utilid ELSE 0 END), 0) AS utilid_ferrecasas,
            COALESCE(SUM(CASE WHEN codalm = "0004" THEN utilid ELSE 0 END), 0) AS utilid_troncal,
            COALESCE(SUM(CASE WHEN codalm = "0005" THEN utilid ELSE 0 END), 0) AS utilid_minca,

            COALESCE(SUM(CASE WHEN codalm != "0002" THEN venta ELSE 0 END), 0) AS venta,
            COALESCE(SUM(CASE WHEN codalm != "0002" THEN utilid ELSE 0 END), 0) AS utili
        ')
        ->when($periodo, function ($query, $periodo) {
            return $query->where('period', $periodo);
        })
        ->groupBy('fecope')
        ->orderby('fecope', 'desc')
        ->get();


        return Inertia::render('comercial/vensedes', [
            'almacen' => Venta::select('nomalm')->distinct()->orderby('codalm')->get(),
            'periodos' => $periodos,
            'ventas' => $ventas
        ]);
    }

    public function vendedor(Request $request){
        $periodo = $request->periodo;
        $periodos = Venta::select('period')->distinct()->get();
        $ventas = Venta::selectRaw( 'codalm, nomalm, nitven, nomven, SUM(venta) venta, SUM(utilid) utili')
        ->when($periodo, function ($query, $periodo) {
            return $query->where('period', $periodo);
        })
        ->groupBy('codalm', 'nomalm', 'nitven', 'nomven')
        ->orderBy('codalm')
        ->get();

        $ventastotal = Venta::selectRaw('codalm, nomalm,
                SUM(venta) venta,
                SUM(utilid) utili')
                ->when($periodo, function ($query, $periodo) {
                    return $query->where('period', $periodo);
                })
                ->groupBy('codalm', 'nomalm')
                ->get();

        return Inertia::render('comercial/venvendedor', [
            'almacen' => Venta::select('nomalm')->distinct()->get(),
            'periodos' => $periodos,
            'ventas'   => $ventas,
            'ventastotal' => $ventastotal
        ]);
    }

    public function importar(){
        return Inertia::render('comercial/importar', [
            'ventas' => Venta::selectRaw('fecope, codalm, nomalm, nitven, nomven, tipdoc, predoc, numdoc, SUM(costo) costo, SUM(venta) venta, SUM(utilid) utili')
                                ->where('tipdoc', 'Factura de Caja')
                                ->orwhere('tipdoc', 'Factura de Venta')
                                ->groupBy('fecope', 'codalm', 'nomalm', 'nitven', 'nomven', 'tipdoc', 'predoc', 'numdoc')
                                ->orderby('fecope', 'desc')
                                ->get()
        ]);
    }

    public function excel(Request $request)
{
    // Aumentar límites de tiempo y memoria para archivos grandes
    ini_set('memory_limit', '-1');
    set_time_limit(0);

    // Validar el archivo
    $request->validate([
        'file' => 'required|file|mimes:xlsx,xls',
    ]);

    // Obtener el archivo
    $file = $request->file('file');

    // Cargar el archivo Excel
    $spreadsheet = IOFactory::load($file->getPathname());
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray();

    $rowNumber = 1;

    foreach (array_slice($rows, 1) as $data) {
        $rowNumber++;

        // encontrar sede para evitar código duplicado
        $codalm = ($data[36] == 'FERRECASAS') ? '0003' : $data[35];

        // calcular días según condición
        $dias = ($data[80] == 'CONTADO') ? '0' : (strpos($data[80], ' ') !== false ? substr($data[80], 0, strpos($data[80], ' ')) : $data[80]);

        // calcular valor iva
        $valiva = ($data[48] * ($data[51] / 100));

        // Procesar fecha
        if (isset($data[74]) && !empty($data[74])) {
            $fechaParts = explode('/', $data[74]);
            if (count($fechaParts) === 3) {
                $dia = $fechaParts[0];
                $mes = $fechaParts[1];
                $anio = $fechaParts[2];
                $fecope = sprintf('%04d-%02d-%02d', $anio, $mes, $dia);
                $period = sprintf('%04d-%02d', $anio, $mes);
                $mesSolo = $mes;
            } else {
                $fecope = null;
                $period = null;
                $mesSolo = null;
            }
        } else {
            $fecope = null;
            $period = null;
            $mesSolo = null;
        }

        // Inserción directa
        try {
            Venta::create([
                'fecope'     => $fecope,
                'period'     => $period,
                'mes'        => $mesSolo,
                'codalm'     => $codalm,
                'nomalm'     => $data[36] ?? null,
                'nitven'     => $data[15] ?? null,
                'nomven'     => $data[16] ?? null,
                'nitpro'     => $data[33] ?? null,
                'nompro'     => $data[34] ?? null,
                'codcla'     => $data[19] ?? null,
                'nomcla'     => $data[20] ?? null,
                'codgru'     => $data[21] ?? null,
                'nomgru'     => $data[22] ?? null,
                'refere'     => $data[37] ?? null,
                'produc'     => $data[38] ?? null,
                'tipmov'     => $data[85] ?? null,
                'tipdoc'     => $data[86] ?? null,
                'predoc'     => $data[78] ?? null,
                'numdoc'     => $data[79] ?? null,
                'dias'       => $dias,
                'poriva'     => $data[51] ?? null,
                'costo'      => $data[59] ?? 0,
                'venta'      => $data[48] ?? 0,
                'utilid'     => $data[52] ?? 0,
                'valiva'     => $valiva ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Registrar el error en el log
            Log::error('Error al importar fila', [
                'fila' => $rowNumber,
                'mensaje' => $e->getMessage(),
                'datos' => $data
            ]);

            // Mostrar mensaje de error
            return back()->withErrors([
                'error' => "Error en la fila #$rowNumber: " . $e->getMessage()
            ]);
        }
    }
    return back()->with('success', 'Importacion Exitosa');
    }
}
