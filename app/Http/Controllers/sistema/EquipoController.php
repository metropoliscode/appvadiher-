<?php

namespace App\Http\Controllers\sistema;

use App\Http\Controllers\Controller;
use App\Models\sistema\equipo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipoController extends Controller
{
    public function index()
    {
        return Inertia::render('sistema/equipos', [
            'equipos' => equipo::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equ_nombre' => 'required|string|max:100',
            'equ_marca' => 'nullable|string|max:100',
            'equ_modelo' => 'nullable|string|max:100',
            'equ_serial' => 'nullable|string|max:100',
            'equ_ramtip' => 'nullable|string|max:10',
            'equ_ramcap' => 'nullable|string|max:50',
            'equ_hddtip' => 'nullable|string|max:10',
            'equ_hddcap' => 'nullable|string|max:50',
            'equ_progen' => 'nullable|string|max:100',
            'equ_prodet' => 'nullable|string|max:100',
            'equ_grafic' => 'nullable|string|max:100',
            'equ_dirmac' => 'nullable|string|max:100',
        ]);

        $validated['equ_equipo'] = gethostname();
        $validated['equ_codope'] = auth()->id();
        $validated['equ_codusu'] = auth()->id();

        equipo::create($validated);
        return redirect()->back()->with('success', 'Equipo creado correctamente.');
    }

    public function update(Request $request, equipo $equipo)
    {
        $validated = $request->validate([
            'equ_nombre' => 'required|string|max:100',
            'equ_marca' => 'nullable|string|max:100',
            'equ_modelo' => 'nullable|string|max:100',
            'equ_serial' => 'nullable|string|max:100',
            'equ_ramtip' => 'nullable|string|max:10',
            'equ_ramcap' => 'nullable|string|max:50',
            'equ_hddtip' => 'nullable|string|max:10',
            'equ_hddcap' => 'nullable|string|max:50',
            'equ_progen' => 'nullable|string|max:100',
            'equ_prodet' => 'nullable|string|max:100',
            'equ_grafic' => 'nullable|string|max:100',
            'equ_dirmac' => 'nullable|string|max:100',
        ]);

        $validated['equ_equipo'] = gethostname();
        $validated['equ_codope'] = auth()->id();
        $validated['equ_codusu'] = auth()->id();

        $equipo->update($validated);

        return redirect()->back()->with('success', 'Equipo actualizado correctamente.');
    }

    public function destroy(equipo $equipo)
    {
        $equipo->delete();
        return redirect()->back()->with('success', 'Equipo eliminado correctamente.');
    }
}
