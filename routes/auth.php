<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\comercial\VentaController;
use App\Http\Controllers\config\AlmacenController;
use App\Http\Controllers\config\AreaController;
use App\Http\Controllers\config\ModuloController;
use App\Http\Controllers\Config\MovconfigController;
use App\Http\Controllers\config\RolController;
use App\Http\Controllers\config\SedeController;
use App\Http\Controllers\config\UserController;
use App\Http\Controllers\Contabilidad\CuentasController;
use App\Http\Controllers\inventario\CompraController;
use App\Http\Controllers\inventario\FacturaController;
use App\Http\Controllers\inventario\StockController;
use App\Http\Controllers\inventario\TicketController;
use App\Http\Controllers\sistema\ClacarpetaController;
use App\Http\Controllers\sistema\CladominioController;
use App\Http\Controllers\sistema\ClaequipoController;
use App\Http\Controllers\sistema\EquipoController;
use App\Http\Controllers\sistema\MantenimientoController;
use App\Http\Controllers\sistema\PasswordController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::resource('facturas', FacturaController::class);

    Route::get('ventas',                    [VentaController::class, 'ventas']);
    Route::get('venta-sede',                [VentaController::class, 'sede']);
    Route::get('ventas-vendedor',           [VentaController::class, 'vendedor']);
    Route::get('importar-ventas',           [VentaController::class, 'importar'])->name('importar-ventas');
    Route::post('importar-excel-ventas',    [VentaController::class, 'excel'])->name('excel-ventas');

    Route::get('compra',                    [CompraController::class, 'compra']);
    Route::get('compra-sede',               [CompraController::class, 'sede']);
    Route::get('compra-provee',             [CompraController::class, 'proveedor']);
    Route::get('importar-compras',          [CompraController::class, 'importar'])->name('importar-compras');
    Route::post('importar-excel-compras',   [CompraController::class, 'excel'])->name('excel-compras');

    Route::get('/contabilidad/cuentas',     [CuentasController::class, 'index'])->name('cuentas.index');

    Route::get('/inventarios/stock',        [StockController::class, 'index'])->name('stock.index');

    Route::get('/inventarios/ticket',         [TicketController::class, 'index'])->name('ticket.index');
    Route::get('/inventarios/ticket/export',  [TicketController::class, 'export'])->name('ticket.export');;
    Route::post('/inventarios/ticket/import', [TicketController::class, 'import'])->name('ticket.import');;
    Route::get('/inventarios/ticket/pdf',     [TicketController::class, 'exportPdf']);

    Route::resource('bitacora',  MovconfigController::class);

});

