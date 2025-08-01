<?php

namespace App\Http\Controllers\sistema;

use App\Http\Controllers\Controller;
use App\Models\sistema\clacor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClacorreoController extends Controller
{
    public function index()
    {
        return Inertia::render('sistema/clacor',[
            'clacorreos' => clacor::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cla_correo' => 'required|string|max:100',
            'cla_clave' => 'required|string|max:100',
        ]);

        $data['cla_equipo'] = gethostname();
        $data['cla_codope'] = auth()->id();
        $data['cla_codusu'] = auth()->id();

        clacor::create($data);

        return redirect()->back()->with('success', 'Clave creada correctamente.');
    }

    public function update(Request $request, clacor $clacor)
    {
        $data = $request->validate([
            'cla_correo' => 'required|string|max:100',
            'cla_clave' => 'required|string|max:100',
        ]);

        $data['cla_equipo'] = gethostname();
        $data['cla_codope'] = auth()->id();
        $data['cla_codusu'] = auth()->id();

        $clacor->update($data);

        return redirect()->back()->with('success', 'Clave actualizada correctamente.');
    }

    public function delete(clacor $clacor)
    {
        $clacor->delete();

        return redirect()->back()->with('success', 'Clave eliminada correctamente.');
    }
}
