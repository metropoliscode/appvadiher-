<?php

namespace App\Http\Controllers\config;

use App\Http\Controllers\Controller;
use App\Models\config\Almacen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlmacenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('config/almacenes/almacen',[
            'almacenes' => Almacen::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('config/almacenes/almacen-create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ALM_CODIGO' => 'required|string|max:255',
            'ALM_NOMBRE' => 'required|string|max:255',
            'ALM_DETALL' => 'nullable|string|max:255',
            'ALM_NIT'    => 'nullable|string|max:255',
        ]);

        $data['ALM_EQUIPO'] = gethostname();
        $data['ALM_CODOPE'] = auth()->id();
        $data['ALM_CODUSU'] = auth()->id();

        Almacen::create($data);

        return redirect()->back()->with('success', 'Almacen creado correctamente.');
    }

    public function update(Request $request, Almacen $Almacen)
    {
       $request->validate([
            'ALM_CODIGO' => 'required|string|max:255',
            'ALM_NOMBRE' => 'required|string|max:255',
            'ALM_DETALL' => 'nullable|string|max:255',
            'ALM_NIT'    => 'nullable|string|max:255',
        ]);

        $data['ALM_EQUIPO'] = gethostname();
        $data['ALM_CODOPE'] = auth()->id();
        $data['ALM_CODUSU'] = auth()->id();

        Almacen::update($data);

        return redirect()->back()->with('success', 'Almacen Actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $almacen = Almacen::find($id);
        if($request->fisico){
            $almacen->delete();
        }else{
            $almacen->ALM_ESTADO = '1';
            $almacen->ALM_DELETE= '1';
            $almacen->save();
        }
        return redirect()->route('almacenes.index')->with('success', 'Almacen eliminado con exito');
    }
}
