<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use App\Models\inventario\stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request){
        $search = $request->input('search');

        $query = stock::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('refere', 'like', "%{$search}%")
                    ->orWhere('nombre', 'like', "%{$search}%");
            });
        }

        return Inertia::render('inventario/stock/stocktroncal', [
            'stock' => $query->get(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
