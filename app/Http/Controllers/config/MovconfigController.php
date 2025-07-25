<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Models\Config\Movconfig;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MovconfigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('bitacora', [
            'movimientos' => Movconfig::all(),
        ]);
    }

    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $movimiento = Movconfig::find($id);
        return response()->json([
            'status' => true,
            'data' => $movimiento
        ]);
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
