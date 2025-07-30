<?php

namespace App\Observers\Config;

use App\Models\User;
use App\Models\Config\Movconfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $newValues = $user->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Adicion Registro',
            'MOV_CODOPE' => Auth::id() ?? 1,
            'MOV_CODALM' => auth()->user()->codalm ?? '0001',
            'MOV_DETALL' => 'Se ha Adiccionado el usuario ' . $newValues['code'],
            'MOV_CODMOD' => 'USUARIOS',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $oldValues = $user->getOriginal();
        $newValues = $user->getAttributes();
        unset($oldValues['created_at']);
        unset($newValues['created_at']);
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);

        if($newValues['delete'] != $oldValues['delete'] ){
            $codigo = Movconfig::max('MOV_CONMOV');
            if($oldValues['delete'] == 0){
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
                'MOV_DETALL' => 'Se ha ' . $funcion . ' el Usuario ' . $newValues['code'],
                'MOV_CODMOD' => 'USUARIOS',
                'MOV_EQUIPO' => gethostname(),
                'MOV_PERIOD' => date('Y')
            ]);
        }else{
            if($newValues['state'] == '0'){
                $oldValues['state'] = 'ACTIVO';
                $newValues['state'] = 'INACTIVO';
            }else{
                $oldValues['state'] = 'INACTIVO';
                $newValues['state'] = 'ACTIVO';
            }
            foreach($oldValues as $campo => $oldValue){
                $codigo = Movconfig::max('MOV_CONMOV');
                if($oldValue != $newValues[$campo]){
                    Movconfig::create([
                        'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                        'MOV_EVENTO' => 'Edicion Registro',
                        'MOV_CODOPE' => Auth::id(),
                        'MOV_CODALM' => auth()->user()->codalm,
                        'MOV_DETALL' => 'Se ha Modificado el valor ' . $oldValue . ' por ' . $newValues[$campo] . ' del Usuario ' . $newValues['code'],
                        'MOV_CODMOD' => 'USUARIOS',
                        'MOV_EQUIPO' => gethostname(),
                        'MOV_PERIOD' => date('Y')
                    ]);
                }
            }
        }
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        $newValues = $user->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Eliminacion Fisica',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Eliminado de los registros el Usuario ' . $newValues['code'],
            'MOV_CODMOD' => 'USUARIOS',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
