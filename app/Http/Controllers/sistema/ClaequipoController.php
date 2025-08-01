<?php

namespace App\Http\Controllers\sistema;

use App\Http\Controllers\Controller;
use App\Models\sistema\cladis;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClaequipoController extends Controller
{
    public function index()
    {
        return Inertia::render('sistema/claeqi', [
            'claequipos' => cladis::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cla_nombre' => 'required|string|max:100',
            'cla_usuari' => 'required|string|max:100',
            'cla_clave' => 'required|string|max:100',
            'cla_nomwif' => 'nullable|string|max:100',
            'cla_clawif' => 'nullable|string|max:100',
            'cla_ip'     => 'nullable|string|max:100',
            'cla_patron' => 'nullable|string|max:100',
            'cla_serial' => 'nullable|string|max:100',
        ]);

        $data['cla_equipo'] = gethostname();
        $data['cla_codope'] = auth()->id();
        $data['cla_codusu'] = auth()->id();

        cladis::create($data);

        return redirect()->back()->with('success', 'Clave creada correctamente.');
    }

    public function update(Request $request, cladis $cladis)
    {
        $data = $request->validate([
            'cla_nombre' => 'required|string|max:100',
            'cla_usuari' => 'required|string|max:100',
            'cla_clave'  => 'required|string|max:100',
            'cla_nomwif' => 'nullable|string|max:100',
            'cla_clawif' => 'nullable|string|max:100',
            'cla_ip'     => 'nullable|string|max:100',
            'cla_patron' => 'nullable|string|max:100',
            'cla_serial' => 'nullable|string|max:100',
        ]);

        $data['cla_equipo'] = gethostname();
        $data['cla_codusu'] = auth()->id();

        $cladis->update($data);

        return redirect()->back()->with('success', 'Clave actualizada correctamente.');
    }

    public function delete(cladis $cladis)
    {
        $cladis->delete();

        return redirect()->back()->with('success', 'Clave eliminada correctamente.');
    }
}
