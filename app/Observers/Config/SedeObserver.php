<?php

namespace App\Observers\Config;

use App\Models\Config\Sede;
use App\Models\Config\Movconfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SedeObserver
{
    /**
     * Handle the Sede "created" event.
     */
    public function created(Sede $sede): void
    {
        $newValues = $sede->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Adicion Registro',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Adiccionado las Sede ' . $newValues['SED_NOMBRE'],
            'MOV_CODMOD' => 'SEDES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Sede "updated" event.
     */
    public function updated(Sede $sede): void
    {
        $oldValues = $sede->getOriginal();
        $newValues = $sede->getAttributes();
        unset($oldValues['created_at']);
        unset($newValues['created_at']);
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);

        if($newValues['SED_DELETE'] != $oldValues['SED_DELETE'] ){
            $codigo = Movconfig::max('MOV_CONMOV');
            if($oldValues['SED_DELETE'] == 0){
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
                'MOV_DETALL' => 'Se ha ' . $funcion . ' la Sede ' . $newValues['SED_NOMBRE'],
                'MOV_CODMOD' => 'SEDES',
                'MOV_EQUIPO' => gethostname(),
                'MOV_PERIOD' => date('Y')
            ]);
        }else{
            if($newValues['SED_ESTADO'] == '0'){
                $oldValues['SED_ESTADO'] = 'ACTIVO';
                $newValues['SED_ESTADO'] = 'INACTIVO';
            }else{
                $oldValues['SED_ESTADO'] = 'INACTIVO';
                $newValues['SED_ESTADO'] = 'ACTIVO';
            }
            foreach($oldValues as $campo => $oldValue){
                $codigo = Movconfig::max('MOV_CONMOV');
                if($oldValue != $newValues[$campo]){
                    Movconfig::create([
                        'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                        'MOV_EVENTO' => 'Edicion Registro',
                        'MOV_CODOPE' => Auth::id(),
                        'MOV_CODALM' => auth()->user()->codalm,
                        'MOV_DETALL' => 'Se ha Modificado el valor ' . $oldValue . ' por ' . $newValues[$campo] . ' de la Sede ' . $newValues['SED_NOMBRE'],
                        'MOV_CODMOD' => 'SEDES',
                        'MOV_EQUIPO' => gethostname(),
                        'MOV_PERIOD' => date('Y')
                    ]);
                }
            }
        }
    }

    /**
     * Handle the Sede "deleted" event.
     */
    public function deleted(Sede $sede): void
    {
        $newValues = $sede->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Eliminacion Fisica',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Eliminado de los registros la Sede ' . $newValues['SED_NOMBRE'],
            'MOV_CODMOD' => 'ROLES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Sede "restored" event.
     */
    public function restored(Sede $sede): void
    {
        //
    }

    /**
     * Handle the Sede "force deleted" event.
     */
    public function forceDeleted(Sede $sede): void
    {
        //
    }
}
