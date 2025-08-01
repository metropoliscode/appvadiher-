<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sysalmace', function (Blueprint $table) {
            $table->id();
            $table->string('ALM_CODIGO', 100)->unique();
            $table->string('ALM_NOMBRE', 100);
            $table->string('ALM_DETALL', 100);
            $table->string('ALM_NIT', 100)->unique();
            $table->string('ALM_EQUIPO', 100);
            $table->bigInteger('ALM_ESTADO')->default(0);
            $table->bigInteger('ALM_DELETE')->default(0);
            $table->bigInteger('ALM_CODOPE')->default(1);
            $table->bigInteger('ALM_CODUSU')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sysalmace');
    }
};
