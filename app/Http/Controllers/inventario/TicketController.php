<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use App\Models\inventario\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TicketController extends Controller
{
    public function index(Request $request){

        $refere = Ticket::paginate(20);

        return Inertia::render('inventario/stock/tickets', [
            'refere' => $refere,
        ]);
    }

    public function export()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Encabezados
        $sheet->setCellValue('A1', 'REFERENCIA');
        $sheet->setCellValue('B1', 'NOMBRE O DESCRIPCION');
        $sheet->setCellValue('C1', 'UNDMED');
        $sheet->setCellValue('D1', 'CODIGO');

        // Datos desde base de datos
        $tickets = Ticket::select('ref_refere', 'ref_nombre', 'ref_codigo', 'ref_undmed')->get();

        $row = 2;
        foreach ($tickets as $ticket) {
            $sheet->setCellValue("A{$row}", $ticket->ref_refere);
            $sheet->setCellValue("B{$row}", $ticket->ref_nombre);
            $sheet->setCellValue("C{$row}", $ticket->ref_undmed);
            $sheet->setCellValue("D{$row}", $ticket->ref_codigo);
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'referencias.xlsx';

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control'       => 'max-age=0',
        ]);
    }

    public function import(Request $request)
    {
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        for ($i = 1; $i < count($rows); $i++) {
            $row = $rows[$i];

            $referencia = trim($row[0] ?? '');

            // Ignorar filas sin referencia
            if (empty($referencia)) {
                continue;
            }

            Ticket::create([
                'ref_refere' => $referencia,
                'ref_nombre' => $row[1] ?? '',
                'ref_undmed' => $row[2] ?? '',
                'ref_codigo' => $row[3] ?? '',
            ]);
        }

        return redirect()->back()->with('success', 'Archivo importado correctamente.');
    }

    public function exportPdf()
    {
        try {
            $tickets = collect(Ticket::get());

            $logoPath = public_path('vadiher.png');
            $logoBase64 = file_exists($logoPath)
                ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
                : null;

            $pdf = Pdf::loadView('pdfticket', [
                'tickets' => $tickets,
                'logo' => $logoBase64,
            ])->setPaper('letter', 'portrait');

            return $pdf->download('tickets.pdf');
        } catch (\Throwable $e) {
            Log::error("PDF error: " . $e->getMessage());
            return back()->with('error', 'Error generando el PDF.');
        }
    }

}
