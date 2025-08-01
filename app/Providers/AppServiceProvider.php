<?php

namespace App\Providers;

use App\Models\comercial\Venta;
use App\Models\config\Almacen;
use App\Models\config\Area;
use App\Models\config\Modulo;
use App\Models\config\Sede;
use App\Models\User;
use App\Observers\Comercial\VentaObserver;
use App\Observers\Config\AlmacenObserver;
use App\Observers\Config\AreaObserver;
use App\Observers\Config\ModuloObserver;
use App\Observers\Config\RolObserver;
use App\Observers\Config\SedeObserver;
use App\Observers\Config\UserObserver;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'modulosPermitidos' => function () {
                if (!Auth::check()) return [];

                return Modulo::where('MOD_TIPO', 1)
                    ->get()
                    ->filter(function ($mod) {
                        return Auth::user()->can(ltrim($mod->MOD_URL, '/') . '.index');
                    })
                    ->values()
                    ->map(function ($mod) {
                        return [
                            'id' => $mod->id,
                            'MOD_NOMBRE' => $mod->MOD_NOMBRE,
                            'MOD_URL' => $mod->MOD_URL,
                            'MOD_ICONO' => $mod->MOD_ICONO,
                        ];
                    });
            },

            'submodulosPermitidos' => function () {
                if (!Auth::check()) return [];

                return Modulo::whereNot('MOD_TIPO', 1)
                    ->get()
                    ->filter(fn($mod) => Auth::user()->can(ltrim($mod->MOD_URL, '/') . '.index'))
                    ->values()
                    ->map(fn($mod) => [
                        'id' => $mod->id,
                        'MOD_NOMBRE' => $mod->MOD_NOMBRE,
                        'MOD_URL' => $mod->MOD_URL,
                        'MOD_ICONO' => $mod->MOD_ICONO,
                        'MOD_DETALL' => $mod->MOD_DETALL,
                        'MOD_PARENT' => $mod->MOD_PARENT,
                        'MOD_TIPO' => $mod->MOD_TIPO,
                    ]);
            },
        ]);

        Almacen::observe(AlmacenObserver::class);
        Area::observe(AreaObserver::class);
        Modulo::observe(ModuloObserver::class);
        Role::observe(RolObserver::class);
        Sede::observe(SedeObserver::class);
        User::observe(UserObserver::class);
        Venta::observe(VentaObserver::class);
        Inertia::share([
            'toast' => fn () => session('toast'),
        ]);
    }
}
