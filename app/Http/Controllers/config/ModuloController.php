<?php

namespace App\Http\Controllers\config;

use App\Http\Controllers\Controller;
use App\Models\config\Modulo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuloController extends Controller
{
    public function index()
    {
        return Inertia::render('config/modulos/modulo', [
            'modulos' => Modulo::all(),
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
        //
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
