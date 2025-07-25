<?php

use App\Http\Controllers\config\MenuController;
use App\Http\Controllers\config\ModuloController;
use App\Http\Controllers\Home\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard',     [HomeController::class, 'index'])->name('dashboard');
    Route::get('configuracion', [MenuController::class, 'modulos'])->name('configuracion');
    Route::get('contabilidad',  [MenuController::class, 'modulos'])->name('contabilidad');
    Route::get('compras',       [MenuController::class, 'modulos'])->name('compras');
    Route::get('inventarios',   [MenuController::class, 'modulos'])->name('inventarios');
    Route::get('comercial',     [MenuController::class, 'modulos'])->name('comercial');
    Route::get('sistemas',      [MenuController::class, 'modulos'])->name('sistemas');
    Route::get('contrasenas',   [MenuController::class, 'modulos'])->name('contrasenas');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
