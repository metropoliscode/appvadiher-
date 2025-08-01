<?php

namespace App\Http\Controllers\config;

use App\Http\Controllers\Controller;
use App\Models\config\Sede;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SedeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('config/sedes/sede', [
            'sedes' => Sede::all(),
        ]);
    }

   public function store(Request $request)
    {
        $data = $request->validate([
            'SED_CODIGO' => 'required|string|max:100',
            'SED_NOMBRE' => 'required|string|max:100',
        ]);

        $data['cla_equipo'] = gethostname();
        $data['cla_codope'] = auth()->id();
        $data['cla_codusu'] = auth()->id();

        Sede::create($data);

        return redirect()->back()->with('success', 'Sede creada correctamente.');
    }

    public function update(Request $request, Sede $Sede)
    {
        $data = $request->validate([
            'cla_correo' => 'required|string|max:100',
            'cla_clave' => 'required|string|max:100',
        ]);

        $data['cla_equipo'] = gethostname();
        $data['cla_codope'] = auth()->id();
        $data['cla_codusu'] = auth()->id();

        $Sede->update($data);

        return redirect()->back()->with('success', 'Sede actualizada correctamente.');
    }

    public function delete(Sede $Sede)
    {
        $Sede->delete();

        return redirect()->back()->with('success', 'Sede eliminada correctamente.');
    }
}
