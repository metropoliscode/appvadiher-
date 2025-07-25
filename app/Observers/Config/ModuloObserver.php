<?php

namespace App\Observers\Config;

use App\Models\Config\Modulo;
use App\Models\Config\Movconfig;
use App\Models\Config\Permiso;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class ModuloObserver
{
    /**
     * Handle the Modulo "created" event.
     */
    public function created(Modulo $modulo): void
    {
        $newValues = $modulo->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        if($newValues['MOD_TIPO'] == '1'){
            $tipo = 'Modulo';
        }elseif($newValues['MOD_TIPO'] == '2'){
            $tipo = 'Submodulo';
        }else{
            $tipo = 'Items';
        }

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Adicion Registro',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Adiccionado el '. $tipo . ' ' . $newValues['MOD_NOMBRE'],
            'MOV_CODMOD' => 'MODULO',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);

        if($tipo != 'Modulo'){
            $slug = [
                ['name' => 'index', 'detalle' => 'Ver'],
                ['name' =>  'store', 'detalle' => 'Crear'],
                ['name' =>  'update', 'detalle' => 'Editar'],
                ['name' =>  'destroy', 'detalle' => 'Eliminar']
            ];
            $modul = str_replace('/', '', $newValues['MOD_URL']);
            foreach ($slug as $key => $value) {
                $codigo = Permission::max('PER_CODIGO');
                Permission::create([
                    'PER_CODIGO' => Str::padLeft($codigo + 1, 3,'0'),
                    'PER_NOMBRE' => $modul . '.' . $value['name'],
                    'PER_DETALL' => $value['detalle'] . ' ' . $value['name'],
                    'PER_CODMOD' => $newValues['MOD_NOMBRE'],
                    'PER_EQUIPO' => gethostname(),
                    'PER_CODOPE' => Auth::id(),
                    'PER_CODUSU' => Auth::id()
                ]);
            }
        }

    }

    /**
     * Handle the Modulo "updated" event.
     */
    public function updated(Modulo $modulo): void
    {
        $oldValues = $modulo->getOriginal();
        $newValues = $modulo->getAttributes();
        unset($oldValues['created_at']);
        unset($newValues['created_at']);
        unset($oldValues['updated_at']);
        unset($newValues['updated_at']);

        if($newValues['MOD_TIPO'] == '1'){
            $tipo = 'Modulo';
        }elseif($newValues['MOD_TIPO'] == '2'){
            $tipo = 'Submodulo';
        }else{
            $tipo = 'Items';
        }

        if($newValues['MOD_DELETE'] != $oldValues['MOD_DELETE'] ){
            $codigo = Movconfig::max('MOV_CONMOV');
            if($oldValues['MOD_DELETE'] == 0){
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
                'MOV_DETALL' => 'Se ha ' . $funcion . ' el ' . $tipo . ' ' . $newValues['MOD_NOMBRE'],
                'MOV_CODMOD' => 'MODULO',
                'MOV_EQUIPO' => gethostname(),
                'MOV_PERIOD' => date('Y')
            ]);
        }else{
            if($oldValues['MOD_ESTADO'] == '0'){
                $oldValues['MOD_ESTADO'] = 'ACTIVO';
                $newValues['MOD_ESTADO'] = 'INACTIVO';
            }else{
                $oldValues['MOD_ESTADO'] = 'INACTIVO';
                $newValues['MOD_ESTADO'] = 'ACTIVO';
            }
            foreach($oldValues as $campo => $oldValue){
                $codigo = Movconfig::max('MOV_CONMOV');
                if($oldValue != $newValues[$campo]){
                    Movconfig::create([
                        'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
                        'MOV_EVENTO' => 'Edicion Registro',
                        'MOV_CODOPE' => Auth::id(),
                        'MOV_CODALM' => auth()->user()->codalm,
                        'MOV_DETALL' => 'Se ha Modificado el valor ' . $oldValue . ' por ' . $newValues[$campo] . ' del ' . $tipo . ' ' . $newValues['MOD_NOMBRE'],
                        'MOV_CODMOD' => 'MODULO',
                        'MOV_EQUIPO' => gethostname(),
                        'MOV_PERIOD' => date('Y')
                    ]);
                }
            }
        }
    }

    /**
     * Handle the Modulo "deleted" event.
     */
    public function deleted(Modulo $modulo): void
    {
        $newValues = $modulo->getAttributes();
        unset($newValues['created_at']);  // Eliminar `created_at` de los valores
        unset($newValues['updated_at']);  // Eliminar `updated_at` de los valores

        if($newValues['MOD_TIPO'] == '1'){
            $tipo = 'Modulo';
        }elseif($newValues['MOD_TIPO'] == '2'){
            $tipo = 'Submodulo';
        }else{
            $tipo = 'Items';
        }

        $codigo = Movconfig::max('MOV_CONMOV');
        Movconfig::create([
            'MOV_CONMOV' => Str::padLeft($codigo + 1, 9, '0'),
            'MOV_EVENTO' => 'Eliminacion Fisica',
            'MOV_CODOPE' => Auth::id(),
            'MOV_CODALM' => auth()->user()->codalm,
            'MOV_DETALL' => 'Se ha Eliminado de los registros el ' . $tipo . ' ' . $newValues['MOD_NOMBRE'],
            'MOV_CODMOD' => 'ALMACENES',
            'MOV_EQUIPO' => gethostname(),
            'MOV_PERIOD' => date('Y')
        ]);
    }

    /**
     * Handle the Modulo "restored" event.
     */
    public function restored(Modulo $modulo): void
    {
        //
    }

    /**
     * Handle the Modulo "force deleted" event.
     */
    public function forceDeleted(Modulo $modulo): void
    {
        //
    }
}
