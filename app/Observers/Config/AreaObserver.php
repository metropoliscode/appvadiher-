<?php

namespace App\Observers\Config;

use App\Models\Config\Area;
use App\Models\Config\Movconfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AreaObserver
{
    /**
     * Handle the Area "created" event.
     */
    public function created(Area $area): void
    {
        $newValues = $area->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Adicion Registro',
            'MOV_CODOPE' => Auth::id() ?? 1,
            'MOV_CODALM' => auth()->user()->codalm ?? '0001',
            'MOV_DETALL' => 'Se ha Adiccionado el Area ' . $newValues['ARE_NOMBRE'],
            'MOV_CODMOD' => 'AREAS',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Area "updated" event.
     */
    public function updated(Area $area): void
    {
        $oldValues = $area->getOriginal();
        $newValues = $area->getAttributes();
        unset($oldValues['created_at']);
        unset($newValues['created_at']);
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);

        if($newValues['ARE_DELETE'] != $oldValues['ARE_DELETE'] ){
            $codigo = Movconfig::max('MOV_CONMOV');
            if($oldValues['ARE_DELETE'] == 0){
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
                'MOV_DETALL' => 'Se ha ' . $funcion . ' el Area ' . $newValues['ARE_NOMBRE'],
                'MOV_CODMOD' => 'AREAS',
                'MOV_EQUIPO' => gethostname(),
                'MOV_PERIOD' => date('Y')
            ]);
        }else{
            if($oldValues['ARE_ESTADO'] == '0'){
                $oldValues['ARE_ESTADO'] = 'ACTIVO';
                $newValues['ARE_ESTADO'] = 'INACTIVO';
            }else{
                $oldValues['ARE_ESTADO'] = 'INACTIVO';
                $newValues['ARE_ESTADO'] = 'ACTIVO';
            }
            foreach($oldValues as $campo => $oldValue){
                $codigo = Movconfig::max('MOV_CONMOV');
                if($oldValue != $newValues[$campo]){
                    Movconfig::create([
                        'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                        'MOV_EVENTO' => 'Edicion Registro',
                        'MOV_CODOPE' => Auth::id(),
                        'MOV_CODALM' => auth()->user()->codalm,
                        'MOV_DETALL' => 'Se ha Modificado el valor ' . $oldValue . ' por ' . $newValues[$campo] . ' del Area ' . $newValues['ARE_NOMBRE'],
                        'MOV_CODMOD' => 'AREAS',
                        'MOV_EQUIPO' => gethostname(),
                        'MOV_PERIOD' => date('Y')
                    ]);
                }
            }
        }
    }

    /**
     * Handle the Area "deleted" event.
     */
    public function deleted(Area $area): void
    {
        $newValues = $area->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Eliminacion Fisica',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Eliminado de los registros el Area ' . $newValues['ARE_NOMBRE'],
            'MOV_CODMOD' => 'AREAS',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Area "restored" event.
     */
    public function restored(Area $area): void
    {
        //
    }

    /**
     * Handle the Area "force deleted" event.
     */
    public function forceDeleted(Area $area): void
    {
        //
    }
}
