<?php

namespace App\Observers\Config;

use App\Models\Config\Movconfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role as Rol;

class RolObserver
{
    /**
     * Handle the Rol "created" event.
     */
    public function created(Rol $rol): void
    {
        $newValues = $rol->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Adicion Registro',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Adiccionado el Rol ' . $newValues['name'],
            'MOV_CODMOD' => 'ROLES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Rol "updated" event.
     */
    public function updated(Rol $rol): void
    {
        $oldValues = $rol->getOriginal();
        $newValues = $rol->getAttributes();
        unset($oldValues['created_at']);
        unset($newValues['created_at']);
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);

        if($newValues['ROL_DELETE'] != $oldValues['ROL_DELETE'] ){
            $codigo = Movconfig::max('MOV_CONMOV');
            if($oldValues['ROL_DELETE'] == 0){
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
                'MOV_DETALL' => 'Se ha ' . $funcion . ' el Rol ' . $newValues['name'],
                'MOV_CODMOD' => 'ROLES',
                'MOV_EQUIPO' => gethostname(),
                'MOV_PERIOD' => date('Y')
            ]);
        }else{
            if($newValues['ROL_ESTADO'] == '0'){
                $oldValues['ROL_ESTADO'] = 'ACTIVO';
                $newValues['ROL_ESTADO'] = 'INACTIVO';
            }else{
                $oldValues['ROL_ESTADO'] = 'INACTIVO';
                $newValues['ROL_ESTADO'] = 'ACTIVO';
            }
            foreach($oldValues as $campo => $oldValue){
                $codigo = Movconfig::max('MOV_CONMOV');
                if($oldValue != $newValues[$campo]){
                    Movconfig::create([
                        'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                        'MOV_EVENTO' => 'Edicion Registro',
                        'MOV_CODOPE' => Auth::id(),
                        'MOV_CODALM' => auth()->user()->codalm,
                        'MOV_DETALL' => 'Se ha Modificado el valor ' . $oldValue . ' por ' . $newValues[$campo] . ' del Rol ' . $newValues['name'],
                        'MOV_CODMOD' => 'ROLES',
                        'MOV_EQUIPO' => gethostname(),
                        'MOV_PERIOD' => date('Y')
                    ]);
                }
            }
        }
    }

    /**
     * Handle the Rol "deleted" event.
     */
    public function deleted(Rol $rol): void
    {
        $newValues = $rol->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Eliminacion Fisica',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Eliminado de los registros el Rol ' . $newValues['ROL_NOMBRE'],
            'MOV_CODMOD' => 'ROLES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Rol "restored" event.
     */
    public function restored(Rol $rol): void
    {
        //
    }

    /**
     * Handle the Rol "force deleted" event.
     */
    public function forceDeleted(Rol $rol): void
    {
        //
    }
}
