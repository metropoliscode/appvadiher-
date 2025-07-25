<?php

namespace App\Http\Controllers\config;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('config/usuarios/user', [
            'users' => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed'],
        ]);

        $user = User::create([
            'code'      => $request->code,
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'codope'    => Auth::id(),
            'codusu'    => Auth::id(),
            'host'      => gethostname()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Usuario Creado correctamente'
        ], 201);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
        ]);

        $user->update([
            'code' => $request->code,
            'name' => $request->name,
            'email' => $request->email,
            'codusu'    => Auth::id(),
            'host'      => gethostname()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Usuario Actualizado correctamente'
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = User::find($id);
        if($request->fisico == 0){
            $user->estado = 1;
            $user->delete = 1;
            $user->save();
        }else{
            $user->delete();
        }
        return response()->json([
            'status' => true,
            'message' => 'Usuario Eliminado'
        ], 201);
    }
}
