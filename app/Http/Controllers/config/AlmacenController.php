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

        $almacen = new Almacen();
        $almacen->ALM_CODIGO = $request->ALM_CODIGO;
        $almacen->ALM_NOMBRE = $request->ALM_NOMBRE;
        $almacen->ALM_DETALL = $request->ALM_DETALL;
        $almacen->ALM_NIT    = $request->ALM_NIT;
        $almacen->ALM_EQUIPO = gethostname();
        $almacen->ALM_CODOPE = auth()->user()->id;
        $almacen->ALM_CODUSU = auth()->user()->id;
        $almacen->save();

        return redirect()->route('almacenes.index')->with('success', 'Almacen creado con exito' );

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('config/almacenes/almacen-edit', [
            $almacen = Almacen::findOrFail($id),
            'almacen' => $almacen,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'ALM_CODIGO' => 'required|string|max:255',
            'ALM_NOMBRE' => 'required|string|max:255',
            'ALM_DETALL' => 'nullable|string|max:255',
            'ALM_NIT'    => 'nullable|string|max:255',
        ]);
        $almacen = Almacen::find($id);
        $almacen->ALM_CODIGO = $request->ALM_CODIGO;
        $almacen->ALM_NOMBRE = $request->ALM_NOMBRE;
        $almacen->ALM_DETALL = $request->ALM_DETALL;
        $almacen->ALM_NIT    = $request->ALM_NIT;
        $almacen->ALM_ESTADO = $request->ALM_ESTADO;
        $almacen->ALM_EQUIPO = gethostname();
        $almacen->ALM_CODUSU = auth()->user()->id;
        $almacen->save();

        return redirect()->route('almacenes.index')->with('success', 'Almacen actualizado con exito');
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
