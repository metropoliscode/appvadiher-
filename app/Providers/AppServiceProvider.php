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
