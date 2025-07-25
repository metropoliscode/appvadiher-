<?php

namespace App\Observers\Config;

use App\Models\Config\Almacen;
use App\Models\Config\Movconfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AlmacenObserver
{
    /**
     * Handle the Almacen "created" event.
     */
    public function created(Almacen $almacen): void
    {
        $newValues = $almacen->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Adicion Registro',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Adiccionado el almacen ' . $newValues['ALM_NOMBRE'],
            'MOV_CODMOD' => 'ALMACENES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Almacen "updated" event.
     */
    public function updated(Almacen $almacen): void
    {
        $oldValues = $almacen->getOriginal();
        $newValues = $almacen->getAttributes();
        unset($oldValues['created_at']);
        unset($newValues['created_at']);
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);

        if($newValues['ALM_DELETE'] != $oldValues['ALM_DELETE'] ){
            $codigo = Movconfig::max('MOV_CONMOV');
            if($oldValues['ALM_DELETE'] == 0){
                $funcion = 'Eliminado';
                $evento  = 'Eliminacion Registro';
            }else{
                $funcion = 'Recuperado';
                $evento  = 'Reversion Elimacion';
            }

            Movconfig::create([
                'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                'MOV_EVENTO' => $evento,
                'MOV_CODOPE' => Auth::id(),
                'MOV_CODALM' => auth()->user()->codalm,
                'MOV_DETALL' => 'Se ha ' . $funcion . ' el almacen ' . $newValues['ALM_NOMBRE'],
                'MOV_CODMOD' => 'ALMACENES',
                'MOV_EQUIPO' => gethostname(),
                'MOV_PERIOD' => date('Y')
            ]);
        }else{
            if($oldValues['ALM_ESTADO'] == '0'){
                $oldValues['ALM_ESTADO'] = 'ACTIVO';
                $newValues['ALM_ESTADO'] = 'INACTIVO';
            }else{
                $oldValues['ALM_ESTADO'] = 'INACTIVO';
                $newValues['ALM_ESTADO'] = 'ACTIVO';
            }
            foreach($oldValues as $campo => $oldValue){
                $codigo = Movconfig::max('MOV_CONMOV');
                if($oldValue != $newValues[$campo]){
                    Movconfig::create([
                        'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                        'MOV_EVENTO' => 'Edicion Registro',
                        'MOV_CODOPE' => Auth::id(),
                        'MOV_CODALM' => auth()->user()->codalm,
                        'MOV_DETALL' => 'Se ha Modificado el valor ' . $oldValue . ' por ' . $newValues[$campo] . ' del Almacen ' . $newValues['ALM_NOMBRE'],
                        'MOV_CODMOD' => 'ALMACENES',
                        'MOV_EQUIPO' => gethostname(),
                        'MOV_PERIOD' => date('Y')
                    ]);
                }
            }
        }
    }

    public function deleted(Almacen $almacen): void
    {
        $newValues = $almacen->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Eliminacion Fisica',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Eliminado de los registros el almacen ' . $newValues['ALM_NOMBRE'],
            'MOV_CODMOD' => 'ALMACENES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Almacen "restored" event.
     */
    public function restored(Almacen $almacen): void
    {
        //
    }

    /**
     * Handle the Almacen "force deleted" event.
     */
    public function forceDeleted(Almacen $almacen): void
    {
        //
    }
}
