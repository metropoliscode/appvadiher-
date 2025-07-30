<?php

namespace App\Jobs;

use App\Models\inventario\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateTicketsPdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $logoPath = public_path('vadiher.png');
        $logoBase64 = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;

        $filePath = storage_path('app/public/export/tickets_completo.pdf');
        $allTickets = collect();
        $total = Ticket::count();
        $processed = 0;

        Ticket::chunk(300, function ($chunk) use (&$allTickets, &$processed, $total) {
            $allTickets = $allTickets->merge($chunk);
            $processed += $chunk->count();

            cache()->put('ticket_pdf_progress', [
                'processed' => $processed,
                'total' => $total,
            ]);
            usleep(300000); // simula carga, opcional
        });

        $pdf = Pdf::loadView('pdfticket', [
            'tickets' => $allTickets,
            'logo' => $logoBase64,
        ])->setPaper('letter', 'portrait');

        $pdf->save($filePath);

        // Marcar como completado
        cache()->put('ticket_pdf_progress', [
            'processed' => $total,
            'total' => $total,
            'finished' => true,
        ]);
    }
}

