<?php

namespace App\Http\Controllers\config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();

        return Inertia::render('config/roles/rol', [
            'roles' => Role::with('permissions')->get(),
            'permisos' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code'   => 'required|string|unique:roles,code',
            'name'   => 'required|string|max:255',
            'detail' => 'nullable|string|max:255',
        ]);

        Role::create([
            'code'   => $request->code,
            'name'   => $request->name,
            'guard_name' => 'web', // requerido por Spatie
            'detail' => $request->detail,
        ]);

        return redirect()->back()->with('success', 'Rol creado correctamente.');
    }

    public function update(Request $request, string $code)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'detail' => 'nullable|string|max:255',
        ]);

        $role = Role::where('code', $code)->firstOrFail();
        $role->update([
            'name'   => $request->name,
            'detail' => $request->detail,
        ]);

        return redirect()->back()->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy(string $code)
    {
        $role = Role::where('code', $code)->firstOrFail();
        $role->delete();

        return redirect()->back()->with('success', 'Rol eliminado correctamente.');
    }

    public function permisos(Request $request, string $code)
    {
        $request->validate([
            'permisos' => 'array',
            'permisos.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::where('code', $code)->firstOrFail();
        $role->syncPermissions($request->permisos);

        return redirect()->back()->with('success', 'Permisos asignados correctamente.');
    }
}
