<?php

namespace App\Imports;

use App\Models\comercial\Venta;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class VentasImport implements ToModel, WithStartRow
{
    public function onRow(array $data)
    {
        return new Venta([
            'fecope'    => date('Y-m-d'),
            'period'    => date('Y-m'),
            'mes'       => date('m'),
            'codalm'    => $data[0],
            'nomalm'    => $data[1],
            'nitven'    => $data[2],
            'nomven'    => $data[3],
            'codcla'    => $data[4],
            'nomcla'    => $data[5],
            'codgru'    => $data[6],
            'nomgru'    => $data[7],
            'tipdoc'    => $data[8],
            'predoc'    => $data[9],
            'numdoc'    => $data[10],
            'dias'      => $data[11],
            'costo'     => $data[12],
            'venta'     => $data[13],
            'utilid'    => $data[14],
            'created_at'=> now(),
            'updated_at'=> now()
        ]);
    }

    public function startRow(): int
    {
        return 2; // Empieza desde la fila 2 (salta encabezados)
    }
}
