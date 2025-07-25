<?php

namespace App\Models\Config;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Movconfig extends Model
{
    protected $guarded = [];
    protected $table = 'movconfig';

    public function user(){
        return $this->belongsTo(User::class,'MOV_CODOPE');
    }

    public function almacen(){
        return $this->belongsTo(Almacen::class,'MOV_CODALM');
    }

}
