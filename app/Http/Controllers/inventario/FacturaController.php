<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use App\Models\inventario\Factura;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacturaController extends Controller
{
    public function index()
    {
        return Inertia::render('inventario/factura/factura',[
            'facturas' => Factura::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'numdoc' => 'required|string',
        ]);

        if($request->predoc == 'REV'){
            $tipdoc = 'Remision';
        }elseif($request->predoc == 'FEVE'){
            $tipdoc = 'Factura Caja';
        }else{
            $tipdoc = 'Factura Electronica';
        }

        $existefactura = Factura::where('fac_numdoc', $request->numdoc)
            ->where('fac_tipdoc', $tipdoc)
            ->first();

        if ($existefactura) {
            // Return error message if the invoice already exists
            return response()->json(['error' => 'El documento ya fue registrado.'], 422);
        }

        return $request->tipdoc;

        $factura = Factura::create([
            'fac_tipdoc'    => $tipdoc,
            'fac_predoc'    => $request->predoc,
            'fac_numdoc'    => $request->numdoc,
            'fac_fecreg'    => Date('Y-m-d'),
        ]);

        $factura->save();

        return response()->json(['message' => 'Factura creada con exito'], 201);
        return redirect()->route('facturas.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
